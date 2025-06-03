import {saveUser, isUserRegistered} from './js/users/utils/userOps.js';
import {User} from './js/users/utils/User.js';

const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');

const loginCheck = user =>{
  if (user){
    loggedInLinks.forEach(link => link.style.display = 'block');
    loggedOutLinks.forEach(link => link.style.display = 'none');
  } else {
    loggedInLinks.forEach(link => link.style.display = 'none');
    loggedOutLinks.forEach(link => link.style.display = 'block');
  }
}

const signinForm = document.querySelector('#login-form');

signinForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.querySelector('#login-email').value;
    const password = document.querySelector('#login-password').value;

    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        if (!user.emailVerified) {
            alert('Por favor verifica tu correo electrónico antes de iniciar sesión.');
            return;
        }

        await sendUserInformation(user);

        signinForm.reset();
        $('#signinModal').modal('hide');

        setTimeout(() => {
            window.location = 'index.html';
        }, 2000);

    } catch (error) {
        console.error('Error al iniciar sesión:', error.message);
        alert('Error: ' + error.message);
    }
});

// Logout
const logout = document.querySelector('#logout');

if (logout) {
    logout.addEventListener('click', (e) => {
        e.preventDefault();
        auth.signOut().then(() => {
            console.log('Sesión cerrada');
        });
    });
}

// Google login
const googleButton = document.querySelector('#googleLogin');

googleButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const provider = new firebase.auth.GoogleAuthProvider();

    try {
        const result = await auth.signInWithPopup(provider);
        const user = result.user;

        if (!user.emailVerified && !user.providerData.some(p => p.providerId === 'google.com')) {
            alert('Por favor verifica tu correo antes de continuar.');
            return;
        }

        await sendUserInformation(user);

        // Cerrar modal
        $('#signinModal').modal('hide');

        setTimeout(() => {
            window.location = 'index.html';
        }, 2000);
    } catch (err) {
        console.error('Error en login con Google:', err.message);
        alert('Error al iniciar sesión con Google: ' + err.message);
    }
});

// Microsoft login
const microsoftButton = document.querySelector('#microsoftLogin');

microsoftButton?.addEventListener('click', async (e) => {
    e.preventDefault();
    const provider = new firebase.auth.OAuthProvider('microsoft.com');

    try {
        const result = await auth.signInWithPopup(provider);
        const user = result.user;

        // Microsoft no requiere emailVerified explícito
        await sendUserInformation(user);

        // Cerrar modal
        $('#signinModal').modal('hide');

        setTimeout(() => {
            window.location = 'index.html';
        }, 2000);
    } catch (err) {
        console.error('Error en login con Microsoft:', err.message);
        alert('Error al iniciar sesión con Microsoft: ' + err.message);
    }
});

const postList = document.querySelector('.posts');
const setupPosts = data => {
    if (data.length) {
      let html = '';
      data.forEach(doc => {
        const post = doc.data()
        const li = `
        <!--li class="list-group-item list-group-item-action">
        <h4><i class="fas fa-comment-medical"></i>&nbsp;${post.titulo}</h4>
        <p>${post.descripcion}</p>
        <a href="tel:5583743064"><button type="button" class="btn btn-info">Agenda tu cita ahora</button></a>
        <br>
        <br>
        <h6><i class="far fa-clock"></i>&nbsp;${post.fecha}</h6>
        </li-->
      <br>
      `;
        html += li;
      });
      postList.innerHTML = html;
    } else {
      postList.innerHTML = '<!--p class="text-center"> Registrate en tu teléfono móvil para ver las últimas noticias. </p-->';
    }
  }

// Eventos
// listar los datos para los usuarios que estés autenticados

auth.onAuthStateChanged(user => {
  if (user) {
    fs.collection('posts')
      .get()
      .then((snapshot) => {
        setupPosts(snapshot.docs)
        loginCheck(user);
        })
    } else {
      setupPosts([])
      loginCheck(user);
    }
})

// Onclick
function noticias() {
  document.location.href = "./index.html"
}

///// Nuevo script

function observador(){
  firebase.auth().onAuthStateChanged(function(user){
    if (user){
    console.log('existe usuario activo')
    contenido.innerHTML = `
        <div class="container mt-5">
            <div class="alert alert-info" role="alert">
                Confirma tu correo y refresca esta pagina
            </div>
        </div>
    `;
    aparece(user);
    var displayName = user.displayName;
    var email = user.email;

    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;

  } else {
    console.log('no existe usuario activo')
    contenido.innerHTML = `
        <!--div class="container mt-5">
        <div class="alert alert-warning" role="alert">
          Registrate con tu email y una contraseña. La contraseña debera tener
          un minimo de 6 caracteres
        </div>
        </div-->
    `;
  }
  });
}
observador();

function aparece(user){
  var user = user;
  var contenido = document.getElementById('contenido');
  if(user.emailVerified){
    contenido.innerHTML = `
      <div>
          <br>
          <p>Bienvenido.</p>
          <h4 class="alert-heading">${user.email}</h4>
      </div>
    `;
  }
}

async function sendUserInformation(user) {
    const email = user.email.toLowerCase();
    const domain = email.split('@')[1];  // ejemplo: "alumno.ipn.mx" o "profesor.ipn.mx"

    let userType = 'Administrador'; // valor por defecto si no cumple ningún caso
    let redirectLink = '/';          // página por defecto
// Definimos reglas claras según el dominio
if (domain.endsWith('ipn.mx') && email.includes('alumno.')) {
    userType = 'Alumno IPN';
    redirectLink = '/public/ipn/alumnos/ipn.html';
}
else if (domain === 'ga.com.mx') {
    userType = 'Alumno UNAM';
    redirectLink = '/public/alumnos/unam.html';
}
else if (domain === 'gmail.com') {
    userType = 'Alumno General';
    redirectLink = '/public/alumnos/mi-espacio.html';
}




    // Creamos usuario para Firebase
    const userDB = new User(userType, email);

    // Guardar usuario si no existe
    const userExist = await isUserRegistered(email);
    if (!userExist) {
        await saveUser(userDB);
    } else {
        console.log('El usuario ya existe en Firebase');
    }

    // Redirigir al usuario según su tipo
    window.location = redirectLink;
}

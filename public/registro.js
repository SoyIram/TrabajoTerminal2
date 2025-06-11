import { saveUser, isUserRegistered } from './js/users/utils/userOps.js';
import { User } from './js/users/utils/User.js';

document.addEventListener('DOMContentLoaded', () => {

  const loggedOutLinks = document.querySelectorAll('.logged-out');
  const loggedInLinks = document.querySelectorAll('.logged-in');

  const loginCheck = user => {
    if (user) {
      loggedInLinks.forEach(link => link.style.display = 'block');
      loggedOutLinks.forEach(link => link.style.display = 'none');
    } else {
      loggedInLinks.forEach(link => link.style.display = 'none');
      loggedOutLinks.forEach(link => link.style.display = 'block');
    }
  };

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

  // Google login
  const googleButton = document.querySelector('#googleLogin');
  googleButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const provider = new firebase.auth.GoogleAuthProvider();

    try {
      const result = await auth.signInWithPopup(provider);
      const user = result.user;

      await sendUserInformation(user);

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

      await sendUserInformation(user);

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
        const post = doc.data();
        html += `<br>`; // Temporal
      });
      postList.innerHTML = html;
    }
  };

  auth.onAuthStateChanged(user => {
    if (user) {
      fs.collection('posts').get().then((snapshot) => {
        setupPosts(snapshot.docs);
        loginCheck(user);

        // Asignar evento de logout dinámicamente
        const logoutBtn = document.querySelector('#logout');
        if (logoutBtn) {
          logoutBtn.addEventListener('click', e => {
            e.preventDefault();
            auth.signOut().then(() => {
              console.log('Sesión cerrada');
              window.location.href = "index.html"; // opcional
            });
          });
        }
      });
    } else {
      setupPosts([]);
      loginCheck(user);
    }
  });

  function noticias() {
    document.location.href = "./index.html";
  }

  function observador() {
    firebase.auth().onAuthStateChanged(function (user) {
      const contenido = document.getElementById('contenido');
      if (user) {
        console.log('existe usuario activo');
        contenido.innerHTML = `
          <div class="container mt-5">
            <div class="alert alert-info" role="alert">
              Confirma tu correo y refresca esta pagina
            </div>
          </div>
        `;
        aparece(user);
      } else {
        console.log('no existe usuario activo');
        contenido.innerHTML = ``;
      }
    });
  }

  function aparece(user) {
    const contenido = document.getElementById('contenido');
    if (user.emailVerified) {
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
    const domain = email.split('@')[1];

    let userType = 'Administrador';
    let redirectLink = '/';

    if (domain === 'alumno.ipn.mx') {
      userType = 'Alumno IPN';
      redirectLink = '/alumnos/ipn.html';
    } else if (domain === 'ga.com.mx') {
      userType = 'Alumno UNAM';
      redirectLink = 'alumnos/unam.html';
    } else if (domain === 'gmail.com') {
      userType = 'Alumno General';
      redirectLink = 'alumnos/mi-espacio.html';
    }

    const userDB = new User(userType, email);
    const userExist = await isUserRegistered(email);

    if (!userExist) {
      await saveUser(userDB);
    } else {
      console.log('El usuario ya existe en Firebase');
    }

    window.location = redirectLink;
  }

  observador();

});

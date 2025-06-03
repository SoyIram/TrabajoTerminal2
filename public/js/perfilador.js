firebase.auth().onAuthStateChanged(user => {
    if (!user) {
        alert("Debes iniciar sesión para acceder.");
        window.location.href = "/index.html";
        return;
    }

    const email = user.email.toLowerCase();
    const domain = email.split('@')[1];
    const path = window.location.pathname;

    const reglas = [
        {
            dominio: 'alumno.ipn.mx',
            permitido: '/public/ipn/',
            redir: '/index.html'
        },
        {
            dominio: 'ga.com.mx',
            permitido: '/public/unam/',
            redir: '/index.html'
        },
        {
            dominio: 'gmail.com',
            permitido: '/public/alumnos/',
            redir: '/index.html'
        }
    ];

    let accesoPermitido = false;

    for (let regla of reglas) {
        const coincideDominio = domain.endsWith(regla.dominio);
        const estaEnRuta = path.startsWith(regla.permitido);

        if (coincideDominio && estaEnRuta) {
            accesoPermitido = true;
            break;
        }
    }

    if (!accesoPermitido) {
        alert("Acceso denegado. No tienes permiso para ver esta página.");
        window.location.href = "/index.html";
    }
});

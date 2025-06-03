if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Registro de SW exitoso', reg))
      .catch(err => console.warn('Error al tratar de registrar el sw', err))
  }
  
  // simplemente se valida si el navegador soporta el service worker
  //hay que registrar la funcion de registro del service worker
  //y se regresa una promesa
  //las promesas son estructuras de programacion asincronas
  //node js checar las promesas asincronas
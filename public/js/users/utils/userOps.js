import {db} from '../firebase/conection.js';
import {addDoc, collection, getDocs} from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js';

/**
 * @description Funcion que me ayudara a guardar objetos de tipo usuario dentro de la coleccion usuarios
 * @param type {string}
 * @param email {string}
 * */
 export const saveUser = (user) => {
    const userToSave = {
        email: user.email,
        type: user.type
    };
    const usersCollection = collection(db, 'users');
    addDoc(usersCollection, userToSave).then(_ => {
        console.log('Usuario registrado con exito');
    }).catch(error => {
        console.log(`Error al guardar usuario: ${error}`);
    });
};

export const isUserRegistered = async (email) => {
    const users = await getAllUsers();
    const user = users.find(user => user.email === email);
    return user ? Object.keys(user).length > 0 : false;
};

export const getAllUsers = async () => {
    const users = [];
    const querySnapshot = await getDocs(collection(db, 'users'));
    querySnapshot.forEach((doc) => {
        users.push(doc.data());
    });
    return users;
};


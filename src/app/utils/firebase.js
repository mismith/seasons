import firebase from 'firebase';
import {FIREBASE} from '../config';

firebase.initializeApp(FIREBASE);

export default {
    login() {
        return firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
    },
    logout() {
        return firebase.auth().signOut();
    },
    user() {
        return firebase.auth().currentUser;
    },
};
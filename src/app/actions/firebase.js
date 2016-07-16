import FirebaseTools from '../utils/firebase';

export function login(){
    return {
        type: 'LOGIN_FIREBASE_USER',
        payload: FirebaseTools.login(),
    };
}

export function user() {
    return {
        type: 'FETCH_FIREBASE_USER',
        payload: FirebaseTools.user(),
    };
};

export function logout(user) {
    return {
        type: 'LOGOUT_FIREBASE_USER',
        payload: FirebaseTools.logout(),
    };
}

export default function(state = null, action) {
    switch (action.type) {
        case 'LOGIN_FIREBASE_USER':
              return action.payload;
        case 'FETCH_FIREBASE_USER':
            return action.payload;
        case 'LOGOUT_FIREBASE_USER':
            return action.payload;
    }
    return state;
}

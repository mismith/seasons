import { combineReducers } from 'redux';
import FirebaseUserReducer from './firebase';

const rootReducer = combineReducers({
    currentUser: FirebaseUserReducer,
});

export default rootReducer;

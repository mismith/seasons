import {user} from '../actions/firebase';

export default function requireAuth(nextState, replace) {
    if (!user()) {
        replace({
            pathname: '/login',
            state: {
                nextPathname: nextState.location.pathname
            }
        })
    }
};
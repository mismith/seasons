import Rebase from 're-base';

const base = Rebase.createClass({
	apiKey: "AIzaSyB9ZedTL4kWLogLr0IT5FandZJGmDHCjT8",
	authDomain: "seasons-d6de7.firebaseapp.com",
	databaseURL: "https://seasons-d6de7.firebaseio.com",
	storageBucket: "seasons-d6de7.appspot.com",
	messagingSenderId: "652680972740",
});
export default {
	...base,

	// helpers
	login() {
		return base.auth().signInWithRedirect(new base.auth.GoogleAuthProvider());
	},
	logout() {
		return base.auth().signOut()
			.then(() => location.pathname = '/'); // @HACK: why needed?
	},

	requireAuth(nextState, replace, callback) {
		base.auth().onAuthStateChanged(me => {
			if (!me) {
				replace({
					path: '/',
					state: {nextPath: nextState.location.pathname},
				});
			}
			callback();
		});
	},

	toArray(obj) {
		return obj ? Object.keys(obj)
			.filter(key => key.match(/^[a-z0-9-_]+$/i))
			.map(key => {
				let item = obj[key];
				if (typeof item === 'object') item.$id = key;
				return item;
			}) : [];
	},
};
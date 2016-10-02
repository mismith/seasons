const firebase = require('firebase');

firebase.initializeApp({
	apiKey: "AIzaSyB9ZedTL4kWLogLr0IT5FandZJGmDHCjT8",
	authDomain: "seasons-d6de7.firebaseapp.com",
	databaseURL: "https://seasons-d6de7.firebaseio.com",
	storageBucket: "seasons-d6de7.appspot.com",
	messagingSenderId: "652680972740",
});
export default {
	...firebase,

	// helpers
	login() {
		return firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider());
	},
	logout() {
		return firebase.auth().signOut()
			.then(() => location.pathname = '/'); // @HACK/@TODO: why needed?
	},

	requireAuth(nextState, replace, callback) {
		firebase.auth().onAuthStateChanged(me => {
			if (!me) {
				replace('/');
			}
			callback();
		});
	},

	sync(context, name, ...path) {
		const ref = firebase.database().ref(path.join('/'));
		context.bindAsObject(ref, name);
		ref.once('value', () => context.setState({[name + 'Loaded']: true}));
	},
	unsync(context, ...names) {
		names.forEach(name => {
			if (context.firebaseRefs[name]) {
				context.unbind(name);
				context.setState({name: {}, [name + 'Loaded']: false});
			}
		});
	},

	key() {
		return firebase.database().ref().push().key;
	},

	toArray(obj) {
		return obj ? Object.keys(obj)
			.filter(key => key.match(/^[a-z0-9-_]+$/i))
			.map(key => {
				let item = obj[key];
				if (typeof item !== 'object') item = {$value: item};
				item.$id = key;
				return item;
			}) : [];
	},

	sortByDatetime(array) {
		array.sort((a, b) => a.datetime < b.datetime ? -1 : 1);

		return array;
	},
};
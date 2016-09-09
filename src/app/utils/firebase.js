import firebase from 'firebase';
import Rebase from 're-base';

export default {
	base: firebase,
	rebase: Rebase.createClass({
		apiKey: "AIzaSyB9ZedTL4kWLogLr0IT5FandZJGmDHCjT8",
		authDomain: "seasons-d6de7.firebaseapp.com",
		databaseURL: "https://seasons-d6de7.firebaseio.com",
		storageBucket: "",
	}),

	// auth
	login() {
		return firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
	},
	logout() {
		return firebase.auth().signOut();
	},
	user() {
		return firebase.auth().currentUser;
	},

	// database
	ref() {
		return firebase.database().ref.apply(this, arguments);
	},

	// helpers
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
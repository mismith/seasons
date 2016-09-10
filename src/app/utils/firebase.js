import Rebase from 're-base';

export default {
	base: Rebase.createClass({
		apiKey: "AIzaSyB9ZedTL4kWLogLr0IT5FandZJGmDHCjT8",
		authDomain: "seasons-d6de7.firebaseapp.com",
		databaseURL: "https://seasons-d6de7.firebaseio.com",
		storageBucket: "",
	}),

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
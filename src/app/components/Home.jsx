import React from 'react';
import {browserHistory} from 'react-router';

import firebase from '../utils/firebase';

import GoogleGIcon from '../images/googleg.svg';
import LogoImg from '../images/logo.svg';

import RaisedButton from 'material-ui/RaisedButton';
import Loader from './helpers/Loader';

export const Home = React.createClass({
	componentWillMount() {
		firebase.auth().onAuthStateChanged(me => {
			if (me) {
				browserHistory.replace('/season/-KRGF6NbHPrSyljL3m3r');
			}
		});
	},
	render() {
		return (
			<div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-around', flexGrow: 1}}>
				<div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
					<h1 style={{marginTop: 0}}>Seasons</h1>
					<img src={LogoImg} />
					<h3>Track your season tickets</h3>
					<br />
				</div>
			{!this.props.me &&
				<div style={{textAlign: 'center'}}>
				{this.props.authLoaded ?
					<RaisedButton
						label="Login with Google"
						icon={<img src={GoogleGIcon} style={{marginTop: -2}} />}
						onClick={firebase.login}
					/>
				:
					<Loader />
				}
				</div>
			}
			</div>
		)
	}
});
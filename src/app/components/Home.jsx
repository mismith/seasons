import React from 'react';

import firebase from '../utils/firebase';

import GoogleGIcon from '../images/googleg.svg';
import LogoImg from '../images/logo.svg';

import RaisedButton from 'material-ui/RaisedButton';

export default React.createClass({
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
					<RaisedButton
						label="Login with Google"
						icon={<img src={GoogleGIcon} style={{marginTop: -2}} />}
						onClick={firebase.login}
					/>
				</div>
			}
			</div>
		)
	}
});
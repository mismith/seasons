import React from 'react';

import LogoImg from '../images/logo.svg';

export default React.createClass({
	render() {
		return (
			<div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '10% 0'}}>
				<h1>Seasons</h1>
				<img src={LogoImg} />
				<h3>Track your season tickets</h3>
			</div>
		)
	}
});
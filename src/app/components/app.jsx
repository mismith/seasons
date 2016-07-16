import React from 'react';
import {Link} from 'react-router';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {login, user, logout} from '../actions/firebase';

const App = React.createClass({
	componentWillMount(){
		this.props.user();
	},
	render() {
		return (
			<div>
				<header>
				{ !this.props.currentUser &&
					<button onClick={this.props.login}>Login</button>
				}
				{ this.props.currentUser &&
					<button onClick={this.props.logout}>Logout</button>
				}
				</header>
				<main>
					{this.props.children}
				</main>
			</div>
		);
	},
});

function mapStateToProps(state){
	return {
		currentUser: state.currentUser,
	};
}
function mapDispatchToProps(dispatch){
	return bindActionCreators({
		login,
		user,
		logout,
	}, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(App);

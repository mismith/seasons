import React from 'react';
import {Link} from 'react-router';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {login, user, logout} from '../actions/firebase';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import AppBar from 'material-ui/AppBar';

const App = React.createClass({
	componentWillMount(){
		this.props.user();
	},
	render() {
		return (
			<MuiThemeProvider>
				<div>
					<AppBar title="Seasons" />
					<main>
						{this.props.children}
					</main>
				</div>
			</MuiThemeProvider>
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

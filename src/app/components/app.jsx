import React from 'react';

// material-ui
import AppBar from 'material-ui/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const App = React.createClass({
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

export default App;
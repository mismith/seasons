import React from 'react';
import ReactDOM from 'react-dom';

// material-ui
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

// components
import App from './components/App';
import Season from './components/Season';

// styles
import './styles/bundle.scss';


ReactDOM.render(
	<MuiThemeProvider>
		<App>
			<Season />
		</App>
	</MuiThemeProvider>
, document.getElementById('app'));

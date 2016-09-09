import React from 'react';
import ReactDOM from 'react-dom';

// routing
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

// material-ui
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

// components
import App from './components/App';
import {Season, SeasonInfo} from './components/Season';
import {Game, GameInfo} from './components/Game';

// styles
import './styles/bundle.scss';


ReactDOM.render(
	<MuiThemeProvider>
		<Router history={browserHistory}>
			<Route path="/" component={App}>
				<IndexRoute />
				<Route path="season/:seasonId">
					<IndexRoute component={Season} />
					<Route path="edit" component={SeasonInfo} />
					<Route path="new" component={SeasonInfo} />
					<Route path="game/:gameId">
						<IndexRoute component={Game} />
						<Route path="edit" component={GameInfo} />
						<Route path="new" component={GameInfo} />
					</Route>
				</Route>
			</Route>
		</Router>
	</MuiThemeProvider>
, document.getElementById('app'));

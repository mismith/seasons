import React from 'react';
import ReactDOM from 'react-dom';

// routing
import {Router, Route, IndexRoute, Redirect, browserHistory} from 'react-router';

// material-ui
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

// components
import App from './components/App';
import Home from './components/Home';
import {Season, SeasonInfo, SeasonSeat} from './components/Season';
import {Game, GameInfo} from './components/Game';

// styles
import './styles/bundle.scss';

// assets
require('./images/logo.png');
require('./images/touchicon.png');

ReactDOM.render(
	<MuiThemeProvider>
		<Router history={browserHistory}>
			<Redirect from="/" to="/season/-KRGF6NbHPrSyljL3m3r" />
			<Route path="/" component={App}>
				<IndexRoute component={Home} />
				<Route path="season/:seasonId">
					<IndexRoute component={Season} />
					<Route path="edit">
						<IndexRoute component={SeasonInfo} />
						<Route path="seat/:seatId" component={SeasonSeat} />
					</Route>
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

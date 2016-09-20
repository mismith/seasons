import React from 'react';
import ReactDOM from 'react-dom';

// routing
import {Router, Route, IndexRoute, Redirect, browserHistory} from 'react-router';

// material-ui
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

// firebase
import firebase from './utils/firebase';

// components
import App from './components/App';
import {Home, HomeRedirect} from './components/Home';
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
			<Route path="/" component={App}>
				<IndexRoute component={Home} onEnter={HomeRedirect} name="home" />
				<Route path="season/:seasonId" onEnter={firebase.requireAuth}>
					<IndexRoute component={Season} name="season" />
					<Route path="edit">
						<IndexRoute component={SeasonInfo} name="season.edit" />
						<Route path="seat/:seatId" component={SeasonSeat} name="season.seat" />
					</Route>
					<Route path="new" name="season.new" component={SeasonInfo} />
					<Route path="game/:gameId">
						<IndexRoute component={Game} name="game" />
						<Route path="edit" component={GameInfo} name="game.edit" />
						<Route path="new" component={GameInfo} name="game.new" />
					</Route>
				</Route>
			</Route>
		</Router>
	</MuiThemeProvider>
, document.getElementById('app'));

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
import {Season, SeasonInfo, SeasonSeat, SeasonUser} from './components/Season';
import {Event, EventInfo} from './components/Event';

// styles
import './styles/bundle.scss';

// assets
require('./images/logo.png');
require('./images/touchicon.png');

// reload at last page on homescreen apps
if (('standalone' in navigator) && navigator['standalone']) {
	const lastPath = localStorage.getItem('lastPath');
	//console.log(lastPath, location.pathname);
	if (lastPath && lastPath !== location.pathname) browserHistory.push(lastPath);

	browserHistory.listen(function(e) {
		localStorage.setItem('lastPath', e.pathname);
	});
}

// routes
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
						<Route path="user/:userId" component={SeasonUser} name="season.user" />
					</Route>
					<Route path="event/:eventId">
						<IndexRoute component={Event} name="event" />
						<Route path="edit">
							<IndexRoute component={EventInfo} name="event.edit" />
						</Route>
					</Route>
				</Route>
			</Route>
		</Router>
	</MuiThemeProvider>
, document.getElementById('app'));

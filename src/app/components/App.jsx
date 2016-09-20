import React from 'react';
import {Link, browserHistory} from 'react-router';

import moment from 'moment';
import firebase from '../utils/firebase';
import ReactFireMixin from 'reactfire';

import Drawer from 'material-ui/Drawer';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import AddIcon from 'material-ui/svg-icons/content/add';
import PowerSettingsIcon from 'material-ui/svg-icons/action/power-settings-new';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import GameItem from './GameItem';
import Loader from './helpers/Loader';

export default React.createClass({
	mixins: [ReactFireMixin],
	getDefaultProps() {
		return {
			params: {
				seasonId: 0,
				gameId: 0,
			},
		};
	},
	getInitialState() {
		return {
			drawerOpen: false,

			me: null,

			season:  {},
			game:    {},
			seat:    {},
			games:   {},
			seasons: {},

			seasonLoaded:  false,
			gameLoaded:    false,
			seatLoaded:    false,
			seasonsLoaded: false,
			gamesLoaded:   false,

			authLoaded: false,

			relevantGames: [],
		};
	},


	unbindPageData() {
		firebase.unsync(this, 'season', 'game', 'seat');
	},
	bindPageData(props = this.props) {
		this.unbindPageData();

		if (props.params.seasonId) {
			firebase.sync(this, 'season', 'seasons/' + props.params.seasonId)

			if (props.params.gameId) {
				firebase.sync(this, 'game', 'seasons:games/' + props.params.seasonId + '/' + props.params.gameId);
			}
			if (props.params.seatId ) {
				firebase.sync(this, 'seat', 'seasons/' + props.params.seasonId + '/seats/' + props.params.seatId);
			}
		}
	},
	unbindGlobalData() {
		firebase.unsync(this, 'seasons', 'games');
	},
	bindGlobalData() {
		this.unbindGlobalData();

		firebase.sync(this, 'seasons', 'seasons');
		firebase.sync(this, 'games', 'seasons:games');
	},
	componentWillMount() {
		firebase.auth().onAuthStateChanged(me => {
			if (me) {
				this.bindGlobalData();
				this.bindPageData();
			} else {
				this.unbindGlobalData();
				this.unbindPageData();
			}

			this.setState({
				me, // @TODO: why is this not setting to null on signOut?
				authLoaded: true,
			});
		});
	},
	componentWillReceiveProps(nextProps) {
		this.bindPageData(nextProps);
	},
	componentWillUnmount() {
		this.unbindGlobalData();
		this.unbindPageData();
	},

	isLoaded() {
		if (this.props.params.gameId) {
			return this.state.gameLoaded;
		} else if (this.props.params.seasonId) {
			return this.state.seasonLoaded;
		} else {
			return true;
		}
	},
	getTitle() {
		if (this.props.params.gameId && this.state.gameLoaded) {
			return <span>{this.state.game.opponent} <small>on</small> {moment(this.state.game.datetime).format('MMM d')}</span>
		} else if (this.props.params.seasonId && this.state.seasonLoaded) {
			return this.state.season.name;
		}
		return '';
	},
	getParentUrl() {
		let path = '';
		if (this.props.routes) {
			const routes = this.props.routes.filter(route => route.path && route.path.length > 1); // trim root and any RouteIndex/empty-path-routes
			if (routes.length > 1) { // can only have a parent if it's not the only route
				for (let i = 0; i < routes.length - 1; i++) { // all but the last one
					path += '/' + routes[i].path;
				}
				path = path.replace(/:\w+/ig, key => this.props.params[key.substring(1)]); // replace params with current values
			}
		}
		return path;
	},
	getRightButton() {
		if (this.state.me) {
			if (this.props.routes || this.props.routes.length) {
				let name = this.props.routes[this.props.routes.length - 1].name;
				if (!name.match(/seat|edit$/)) {
					switch (name) {
						case 'season':
							return (
								<IconMenu
									iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
									targetOrigin={{horizontal: 'right', vertical: 'top'}}
									anchorOrigin={{horizontal: 'right', vertical: 'top'}}
								>
									<MenuItem linkButton={true} containerElement={<Link to={'/season/' + this.props.params.seasonId + '/edit'} />}>Edit Details</MenuItem>
								</IconMenu>
							);
							break;
						case 'game':
							return (
								<IconMenu
									iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
									targetOrigin={{horizontal: 'right', vertical: 'top'}}
									anchorOrigin={{horizontal: 'right', vertical: 'top'}}
								>
									<MenuItem linkButton={true} containerElement={<Link to={'/season/' + this.props.params.seasonId + '/game/' + this.props.params.gameId + '/edit'} />}>Edit Details</MenuItem>
								</IconMenu>
							);
					}
				}
			}
		}
		return;
	},
	getRelevantGames() {
		let relevantGames = [],
			upcomingGames = [],
			seasons = this.state.seasons;

		if (seasons) {
			firebase.toArray(this.state.games).map(games => {
				firebase.toArray(games).filter(game => {
					// store for later
					game.$season = seasons[games.$id];
					game.$season.$id = games.$id;

					let dayDiff = -1 * moment().diff(game.datetime, 'days');
					if (dayDiff < 0) {
						// game has passed
						if(!game.seats && !game.sold) {
							// we don't know if sold or attended yet
							return true;
						} else if (dayDiff > -3) {
							// game was in the past 3 days
							return true;
						}
					} else {
						// game is upcoming
						upcomingGames.push(game);

						// game is upcoming soon
						if (dayDiff < 3) {
							// game is in the next 3 days
							return true;
						}
					}
				}).map(game => {
					relevantGames.push(game);
				});
			});

			// pad with upcoming games, if under 3 games
			while (relevantGames.length < 3 && upcomingGames.length) {
				relevantGames.push(upcomingGames.shift());
			}
		}

		return relevantGames;
	},

	handleDrawerToggle() {
		this.setState({drawerOpen: !this.state.drawerOpen});
	},
	handleDrawerClose() {
		this.setState({drawerOpen: false});
	},
	handleChanges(name, changes) {
		switch(name) {
			case 'season':
				firebase.database().ref('seasons/' + this.props.params.seasonId).update(changes);
				break;
			case 'game':
				firebase.database().ref('seasons:games/' + this.props.params.seasonId + '/' + this.props.params.gameId).update(changes);
				break;
			case 'seat':
				firebase.database().ref('seasons/' + this.props.params.seasonId + '/seats/' + this.props.params.seatId).update(changes);
				break;
		}
	},

	render() {
		let relevantGames = this.getRelevantGames();

		return (
			<div id="viewport">
			{this.state.me && 
				<Drawer
					docked={false}
					disableSwipeToOpen={true}
					open={this.state.drawerOpen}
					onRequestChange={this.handleDrawerClose}
					containerStyle={{display: 'flex', flexDirection: 'column'}}
				>
					<List onTouchTap={this.handleDrawerClose}>
						<Subheader>Seasons</Subheader>
					{this.state.seasonsLoaded ? firebase.toArray(this.state.seasons).map(season => 
						<ListItem
						 	key={season.$id}
							primaryText={season.name}
							containerElement={<Link to={'/season/' + season.$id} />}
						/>
					) : <Loader />}
						{/*<ListItem
							primaryText="Add new season"
							rightIcon={<AddIcon />}
							containerElement={<Link to="/season/new" />}
						/>*/}
						<Divider />
					</List>

				{relevantGames.length > 0 && 
					<List onTouchTap={this.handleDrawerClose}>
						<Subheader>Games</Subheader>
					{this.state.gamesLoaded ? relevantGames.map((game, gameIndex) => 
						<GameItem
							key={gameIndex}
							game={game}
							season={game.$season}
							showDayAvatar={false}
							containerElement={<Link to={'/season/' + game.$season.$id + '/game/' + game.$id} />}
						/>
					) : <Loader />}
						<Divider />
					</List>
				}

					<List onTouchTap={this.handleDrawerClose} style={{marginTop: 'auto'}}>
						<Subheader>Account</Subheader>
						<ListItem
							primaryText="Logout"
							rightIcon={<PowerSettingsIcon />}
							onClick={firebase.logout}
						/>
					</List>
				</Drawer>
			}
			{this.state.me &&
				<AppBar
					title={this.getTitle()}
					showMenuIconButton={!!this.state.me}
					onTitleTouchTap={e=>browserHistory.push(this.getParentUrl())}
					onLeftIconButtonTouchTap={this.handleDrawerToggle}
					iconElementRight={this.getRightButton()}
					style={{position: 'fixed'}}
				/>
			}
				<main id="main" style={{paddingTop: this.state.me ? 64 : 0}}>{
					this.isLoaded() ?
						React.cloneElement(this.props.children, {...this.state, handleChanges: this.handleChanges})
					:
						<Loader style={{padding: 40}} />
				}</main>
			</div>
		);
	},
});
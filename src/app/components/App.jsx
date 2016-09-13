import React from 'react';
import {Link, browserHistory} from 'react-router';

import moment from 'moment';
import fire from '../utils/firebase';

import Drawer from 'material-ui/Drawer';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

import AppBar from 'material-ui/AppBar';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import AddIcon from 'material-ui/svg-icons/content/add';
import PowerSettingsIcon from 'material-ui/svg-icons/action/power-settings-new';

import Loader from './helpers/Loader';
import GameItem from './GameItem';

export default React.createClass({
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

			season:  {},
			game:    {},
			games:   {},
			seasons: {},

			seasonLoaded: false,
			gameLoaded: false,
			seasonsLoaded: false,
			gamesLoaded: false,
			seatLoaded: false,

			relevantGames: [],
		};
	},


	unbindPageData() {
		if (this.seasonRef) fire.base.removeBinding(this.seasonRef);
		if (this.gameRef) fire.base.removeBinding(this.gameRef);
		if (this.seatRef) fire.base.removeBinding(this.seatRef);

		this.setState({
			seasonLoaded: false,
			gameLoaded: false,
			seatLoaded: false,
		});
	},
	bindPageData(props = this.props) {
		this.unbindPageData();

		this.seasonRef = props.params.seasonId && fire.base.bindToState('seasons/' + props.params.seasonId, {
			context: this,
			state: 'season',
			then: () => this.setState({seasonLoaded: true}),
		});
		this.gameRef = props.params.gameId && fire.base.bindToState('seasons:games/' + props.params.seasonId + '/' + props.params.gameId, {
			context: this,
			state: 'game',
			then: () => this.setState({gameLoaded: true}),
		});
		this.seatRef = props.params.seatId && fire.base.bindToState('seasons/' + props.params.seasonId + '/seats/' + props.params.seatId, {
			context: this,
			state: 'seat',
			then: () => this.setState({seatLoaded: true}),
		});
	},
	componentWillMount() {
		this.seasonsRef = fire.base.bindToState('seasons', {
			context: this,
			state: 'seasons',
			then: () => {
				this.setState({seasonsLoaded: true}),

				this.gamesRef = fire.base.bindToState('seasons:games', {
					context: this,
					state: 'games',
					then: () => {
						let relevantGames = [],
							upcomingGames = [],
							seasons = this.state.seasons;
						fire.toArray(this.state.games).map(games => {
							fire.toArray(games).filter(game => {
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

						this.setState({
							relevantGames,
							gamesLoaded: true,
						});
					},
				});
			}
		});

		this.bindPageData();
	},
	componentWillReceiveProps(nextProps) {
		this.bindPageData(nextProps);
	},
	componentWillUnmount() {
		fire.base.removeBinding(this.seasonsRef);
		fire.base.removeBinding(this.gamesRef);

		this.setState({
			seasonsLoaded: false,
			gamesLoaded: false,
		});

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
		if (this.props.params.gameId) {
			return this.state.game.opponent;
		} else if (this.props.params.seasonId) {
			return this.state.season.name;
		} else {
			return '';
		}
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

	handleDrawerToggle() {
		this.setState({drawerOpen: !this.state.drawerOpen});
	},
	handleDrawerClose() {
		this.setState({drawerOpen: false});
	},
	handleChanges(name, changes) {
		switch(name) {
			case 'season':
				fire.base.database().ref('seasons/' + this.props.params.seasonId).update(changes);
				break;
			case 'game':
				fire.base.database().ref('seasons:games/' + this.props.params.seasonId + '/' + this.props.params.gameId).update(changes);
				break;
			case 'seat':
				fire.base.database().ref('seasons/' + this.props.params.seasonId + '/seats/' + this.props.params.seatId).update(changes);
				break;
		}
	},

	render() {
		return (
			<div>
				<Drawer
					docked={false}
					open={this.state.drawerOpen}
					containerStyle={{display: 'flex', flexDirection: 'column'}}
				>
					<List onTouchTap={this.handleDrawerClose}>
						<Subheader>Seasons</Subheader>
					{this.state.seasonsLoaded ? fire.toArray(this.state.seasons).map(season => 
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

				{this.state.relevantGames.length > 0 && 
					<List onTouchTap={this.handleDrawerClose}>
						<Subheader>Games</Subheader>
					{this.state.gamesLoaded ? this.state.relevantGames.map((game, gameIndex) => 
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

					{/*<List onTouchTap={this.handleDrawerClose} style={{marginTop: 'auto'}}>
						<Subheader>Account</Subheader>
						<ListItem
							primaryText="Logout"
							rightIcon={<PowerSettingsIcon />}
						/>
					</List>*/}
				</Drawer>
				<AppBar
					title={this.getTitle()}
					onTitleTouchTap={e=>browserHistory.push(this.getParentUrl())}
					onLeftIconButtonTouchTap={this.handleDrawerToggle}
					iconElementRight={
						this.props.params.seasonId &&
						<IconMenu
							iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
							targetOrigin={{horizontal: 'right', vertical: 'top'}}
							anchorOrigin={{horizontal: 'right', vertical: 'top'}}
						>
						{this.props.params.seasonId && !this.props.params.gameId && 
							<MenuItem containerElement={<Link to={'/season/' + this.props.params.seasonId + '/edit'} />}>Edit Details</MenuItem>
						}
						{this.props.params.seasonId && this.props.params.gameId && 
							<MenuItem containerElement={<Link to={'/season/' + this.props.params.seasonId + '/game/' + this.props.params.gameId + '/edit'} />}>Edit Details</MenuItem>
						}
						</IconMenu>
					}
					style={{position: 'fixed'}}
				/>
				<main style={{paddingTop: 64}}>{
					this.isLoaded() ?
						React.cloneElement(this.props.children, {...this.state, handleChanges: this.handleChanges}) :
						<Loader />
				}</main>
			</div>
		);
	},
});
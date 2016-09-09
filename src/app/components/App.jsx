import React from 'react';
import moment from 'moment';
import {Link, browserHistory} from 'react-router';


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

import GameItem from './GameItem';

import Data from '../data';

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
			season: {seats: [], users: []},
			game:   {seats: []},
		};
	},
	componentWillMount() {
		const nextProps = this.props;
		this.setState({
			season: Data.seasons[nextProps.params.seasonId],
			game:   Data['seasons:games'][nextProps.params.seasonId][nextProps.params.gameId],
		});
	},
	componentWillReceiveProps(nextProps) {
		this.setState({
			season: Data.seasons[nextProps.params.seasonId],
			game:   Data['seasons:games'][nextProps.params.seasonId][nextProps.params.gameId],
		});
	},

	handleDrawerToggle() {
		this.setState({drawerOpen: !this.state.drawerOpen});
	},
	handleDrawerClose() {
		this.setState({drawerOpen: false});
	},

	collectRelevantGames() {
		let relevantGames = [];
		Data['seasons:games'].map((games, seasonIndex) => {
			games.filter((game, gameIndex) => {
				game.$id = gameIndex;
				let dayDiff = moment(game.datetime).diff('2016-10-21', 'days');
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
					if (dayDiff < 3) {
						// game is in the next 3 days
						return true;
					}
				}
			}).map(game => {
				game.$season = Data.seasons[seasonIndex];
				game.$season.$id = seasonIndex;
				relevantGames.push(game);
			});
		});
		return relevantGames;
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

	render() {
		let relevantGames = this.collectRelevantGames();
		return (
			<div>
				<Drawer
					docked={false}
					open={this.state.drawerOpen}
					containerStyle={{display: 'flex', flexDirection: 'column'}}
				>
					<List onTouchTap={this.handleDrawerClose}>
						<Subheader>Seasons</Subheader>
					{Data.seasons.map((season, seasonIndex) => 
						<ListItem
						 	key={seasonIndex}
							primaryText={season.name}
							containerElement={<Link to={'/season/' + seasonIndex} />}
						/>
					)}
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
					{relevantGames.map((game, gameIndex) => 
						<GameItem
							key={gameIndex}
							game={game}
							season={game.$season}
							showDayAvatar={false}
							containerElement={<Link to={'/season/' + game.$season.$id + '/game/' + game.$id} />}
						/>
					)}
						<Divider />
					</List>
				}

					<List onTouchTap={this.handleDrawerClose} style={{marginTop: 'auto'}}>
						<Subheader>Account</Subheader>
						<ListItem
							primaryText="Logout"
							rightIcon={<PowerSettingsIcon />}
						/>
					</List>
				</Drawer>
				<AppBar
					title={this.props.params.gameId ? this.state.game.opponent : this.state.season.name}
					onTitleTouchTap={e=>browserHistory.push(this.getParentUrl())}
					onLeftIconButtonTouchTap={this.handleDrawerToggle}
					iconElementRight={
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
				<main style={{paddingTop: 64}}>{this.props.children}</main>
			</div>
		);
	},
});
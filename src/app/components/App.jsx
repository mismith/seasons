import React from 'react';
import Router from '../router';
import moment from 'moment';

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

//import MenuItem from 'material-ui/MenuItem';
//import IconButton from 'material-ui/IconButton';
//import IconMenu from 'material-ui/IconMenu';
//import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import AddIcon from 'material-ui/svg-icons/content/add';
import PowerSettingsIcon from 'material-ui/svg-icons/action/power-settings-new';

import Season from './Season';
import Game from './Game';
import GameItem from './GameItem';

import Data from '../data';

export default React.createClass({
	getInitialState() {
		return {
			drawerOpen: false,

			page: null,
			seasonId: null,
			gameId: null,
		};
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
	getPage(page = this.state.page) {
		switch (page) {
			case 'season':
				return <Season seasonId={this.state.seasonId} tab={'info'} />
			case 'game':
				return <Game seasonId={this.state.seasonId} gameId={this.state.gameId} />
			default:
				return <h1>404: Not Found</h1>
		}
	},

	componentWillMount() {
		const route = () => {
			let location = Router.lookup(window.location.hash.substring(1));

			this.setState({
				page: location.name,
				...location.options,
			});
		};
		route();
		window.addEventListener('hashchange', route);
	},

	render() {
		let relevantGames = this.collectRelevantGames();

		return (
			<div>
				<Drawer
					docked={false}
					open={this.state.drawerOpen}
				>
				{relevantGames.length > 0 && 
					<List onTouchTap={this.handleDrawerClose}>
						<Subheader>Games</Subheader>
					{relevantGames.map((game, gameIndex) => 
						<GameItem
							key={gameIndex}
							game={game}
							season={game.$season}
							showDayAvatar={false}
						/>
					)}
						<Divider />
					</List>
				}

					<List onTouchTap={this.handleDrawerClose}>
						<Subheader>Seasons</Subheader>
					{Data.seasons.map((season, seasonIndex) => 
						<ListItem
							href={Router.href('season', {seasonId: seasonIndex})}
							key={seasonIndex}
							primaryText={season.name}
						/>
					)}
						<ListItem
							href={Router.href('season', {seasonId: 'new'})}
							primaryText="Add new season"
							rightIcon={<AddIcon />}
						/>
						<Divider />
					</List>
					<List onTouchTap={this.handleDrawerClose}>
						<Subheader>Account</Subheader>
						<ListItem
							primaryText="Logout"
							rightIcon={<PowerSettingsIcon />}
						/>
					</List>
				</Drawer>
				<AppBar
					title={"Seasons"}
					onLeftIconButtonTouchTap={this.handleDrawerToggle}
					// iconElementRight={
					// 	<IconMenu
					// 		iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
					// 		targetOrigin={{horizontal: 'right', vertical: 'top'}}
					// 		anchorOrigin={{horizontal: 'right', vertical: 'top'}}
					// 	>
					// 		<MenuItem>View/Edit Season</MenuItem>
					// 	</IconMenu>
					// }
				/>
				<main>
					{this.getPage()}
				</main>
			</div>
		);
	},
});
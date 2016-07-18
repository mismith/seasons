import React from 'react';

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import AddIcon from 'material-ui/svg-icons/content/add';
import PowerSettingsIcon from 'material-ui/svg-icons/action/power-settings-new';

import Data from '../data';

export default React.createClass({
	getDefaultProps() {
		return {
			seasonId: 0,
		};
	},
	getInitialState() {
		return {
			drawerOpen: false,
		};
	},

	handleDrawerToggle() {
		this.setState({drawerOpen: !this.state.drawerOpen});
	},
	handleDrawerClose() {
		this.setState({drawerOpen: false});
	},

	componentWillMount() {
		this.season = Data.seasons[this.props.seasonId];
	},

	render() {
		return (
			<div>
				<AppBar
					title={this.season.name}
					onLeftIconButtonTouchTap={this.handleDrawerToggle}
					iconElementRight={
						<IconMenu
							iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
							targetOrigin={{horizontal: 'right', vertical: 'top'}}
							anchorOrigin={{horizontal: 'right', vertical: 'top'}}
						>
							<MenuItem>View/Edit Season</MenuItem>
						</IconMenu>
					}
				/>
				<Drawer
					docked={false}
					open={this.state.drawerOpen}
				>
					<List onTouchTap={this.handleDrawerClose}>
						<Subheader>Seasons</Subheader>
					{Data.seasons.map((season, seasonId) => 
						<ListItem key={seasonId}>{season.name}</ListItem>
					)}
						<ListItem rightIcon={<AddIcon />}>Add new season</ListItem>
						<Divider />
						<Subheader>Account</Subheader>
						<ListItem rightIcon={<PowerSettingsIcon />}>Logout</ListItem>
					</List>
				</Drawer>
				<main>
					{this.props.children}
				</main>
			</div>
		);
	},
});
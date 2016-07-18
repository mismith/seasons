import React from 'react';

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
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
	render() {
		return (
			<div>
				<AppBar
					title="Seasons"
					onLeftIconButtonTouchTap={this.handleDrawerToggle}
				/>
				<Drawer
					docked={false}
					open={this.state.drawerOpen}
				>
					<List onTouchTap={this.handleDrawerClose}>
						<Subheader>Seasons</Subheader>
						<ListItem>Flames 2016/2017</ListItem>
						<ListItem rightIcon={<AddIcon />}>Add New Season</ListItem>
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
import React from 'react';
import moment from 'moment';
import initialize from './helpers/initialize';

import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Toggle from 'material-ui/Toggle';

import SeatAvatar from './SeatAvatar';

import Data from '../data';


export default React.createClass({
	getDefaultProps() {
		return {
			seasonId: 0,
		};
	},

	componentWillMount() {
		this.season = Data.seasons[this.props.seasonId];
	},

	render() {
		return (
			<div>
				<Divider />
				<List>
					<Subheader>Splitting</Subheader>
				{this.season.users.map((userActive, userId) => 
					<ListItem
						key={userId}
						leftAvatar={<SeatAvatar />}
						rightToggle={<Toggle defaultToggled={userActive} />}
					>{Data.users[userId].name}</ListItem>
				)}
				</List>
			</div>
		);
	},
});
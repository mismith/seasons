import React from 'react';
import moment from 'moment';

import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Toggle from 'material-ui/Toggle';
import TextField from 'material-ui/TextField';

import SeatAvatar from './SeatAvatar';

import Data from '../data';


export default React.createClass({
	getDefaultProps() {
		return {
			seasonId: 0,
			gameId: 0,
		};
	},
	getInitialState() {
		return {
			season: Data.seasons[this.props.seasonId],
			game:   Data['seasons:games'][this.props.seasonId][this.props.gameId],
		};
	},

	getUserSeatIndex(userId) {
		return this.state.game.seats ? this.state.game.seats.indexOf(userId) : -1;
	},
	handleToggle(e, userId) {
		let seats = [].concat(this.state.game.seats || []);
		if (e.currentTarget.checked) {
			seats.push(userId);
		} else {
			seats.splice(this.getUserSeatIndex(userId), 1);
		}
		this.setState({game: {seats}});
	},

	render() {
		return (
			<div>
				<List>
					<div style={{paddingLeft: 16, paddingRight: 16, paddingBottom: 16}}>
						<TextField defaultValue={this.state.game.opponent} floatingLabelText="Opponent" fullWidth={true} />
						<TextField defaultValue={this.state.game.datetime} floatingLabelText="Date & Time" fullWidth={true} />
					</div>
					<Divider />

					<Subheader style={{display: 'flex', justifyContent: 'space-between', paddingRight: 16}}>
						<span>Attendance</span>
						<span>{this.state.game.seats ? this.state.game.seats.length : 0} / {this.state.season.seats.length}</span>
					</Subheader>
				{this.state.season.users.map((user, userId) => 
					<ListItem
						key={userId}
						leftAvatar={<div><SeatAvatar user={user} /></div>}
						rightToggle={<Toggle defaultToggled={this.getUserSeatIndex(userId) >= 0} onToggle={e=>this.handleToggle(e, userId)} disabled={this.getUserSeatIndex(userId) < 0 && this.state.game.seats && this.state.game.seats.length >= this.state.season.seats.length} />}
					>{user.name}</ListItem>
				)}
				</List>
			</div>
		);
	},
});
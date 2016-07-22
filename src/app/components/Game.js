import React from 'react';
import moment from 'moment';

import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Toggle from 'material-ui/Toggle';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
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
	handleGameChange(e, field, value) {
		this.setState({
			game: {
				...this.state.game,
				[field]: value || e.currentTarget.value,
			},
		});
	},
	handleGameUserToggle(e, userId) {
		let seats = [].concat(this.state.game.seats || []);
		if (e.currentTarget.checked) {
			seats.push(userId);
		} else {
			seats.splice(this.getUserSeatIndex(userId), 1);
		}
		this.handleGameChange(e, 'seats', seats);
	},
	handleGameDateTimeChange(type, date) {
		let $datetime = moment(date);
		if (type === 'date') {
			// prevent clearing the existing time
			$datetime = moment($datetime.format('YYYY-MM-DD') + ' ' + moment(this.state.game.datetime).format('h:mma'), 'YYYY-MM-DD h:mma');
		}
		this.handleGameChange(null, 'datetime', $datetime.format());
	},

	render() {
		let {season, game} = this.state;
		return (
			<List>
				<div style={{paddingLeft: 16, paddingRight: 16, paddingBottom: 16}}>
					<TextField defaultValue={game.opponent} onChange={e=>this.handleGameChange(e, 'opponent')} floatingLabelText="Opponent" fullWidth={true} />

					<DatePicker value={moment(game.datetime).toDate()} onChange={(e, date)=>this.handleGameDateTimeChange('date', date)} formatDate={date=>moment(date).format('ddd, MMM D, YYYY')} floatingLabelText="Date" autoOk={true} style={{display: 'inline-flex', width: '50%'}} />
					<TimePicker value={moment(game.datetime).toDate()} onChange={(e, date)=>this.handleGameDateTimeChange('time', date)}  floatingLabelText="Time" autoOk={true} pedantic={true} style={{display: 'inline-flex', width: '50%'}} />

					<TextField defaultValue={game.sold} onChange={e=>this.handleGameChange(e, 'sold')} floatingLabelText="Sale Price" fullWidth={true} />
				</div>
				<Divider />

			{!game.sold && 
				<div>
					<Subheader style={{display: 'flex', justifyContent: 'space-between', paddingRight: 16}}>
						<span>Attendance</span>
						<span>{game.seats ? game.seats.length : 0} / {season.seats.length}</span>
					</Subheader>
				{season.users.map((user, userId) => 
					<ListItem
						key={userId}
						leftAvatar={<div><SeatAvatar user={user} backgroundColor={this.getUserSeatIndex(userId) >= 0 ? '#5176C7' : null} /></div>}
						rightToggle={<Toggle defaultToggled={this.getUserSeatIndex(userId) >= 0} onToggle={e=>this.handleGameUserToggle(e, userId)} disabled={this.getUserSeatIndex(userId) < 0 && game.seats && game.seats.length >= season.seats.length} />}
					>{user.name}</ListItem>
				)}
				</div>
			}
			</List>
		);
	},
});
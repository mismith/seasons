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

import fire from '../utils/firebase';


export const Game = React.createClass({
	getDefaultProps() {
		return {
			season: {seats: [], users: []},
			game:   {seats: []},
		};
	},

	getUserSeatIndex(userId) {
		return this.props.game.seats ? this.props.game.seats.indexOf(userId) : -1;
	},
	handleGameChange(e, field, value) {
		this.setState({
			game: Object.assign(this.state.game, {[field]: value !== undefined ? value : e.currentTarget.value}),
		});
	},
	handleGameUserToggle(e, userId) {
		if (userId === 'sold') {
			let sold = !!this.state.game.sold,
				soldPrice = this.state.game.soldPrice + 0;
			if (e.currentTarget.checked) {
				sold = true;
				soldPrice = soldPrice || prompt('How much did they sell for?');
			} else {
				sold = false;
			}
			this.handleGameChange(e, 'sold', sold);
			this.handleGameChange(e, 'soldPrice', soldPrice);
		} else {
			let seats = [].concat(this.state.game.seats || []);
			if (e.currentTarget.checked) {
				seats.push(userId);
			} else {
				seats.splice(this.getUserSeatIndex(userId), 1);
			}
			this.handleGameChange(e, 'seats', seats);
		}
	},

	render() {
		let {season, game} = this.props;
		return (
			<List>
			{!game.sold &&
				<div>
					<Subheader style={{display: 'flex', justifyContent: 'space-between', paddingRight: 16}}>
						<span>Attendees</span>
						<span>{!game.sold && game.seats ? game.seats.length : 0} / {season.seats.length}</span>
					</Subheader>
				{season.users.map((user, userId) => 
					<ListItem
						key={userId}
						leftAvatar={<div><SeatAvatar user={user} setBackgroundColor={!game.sold && this.getUserSeatIndex(userId) >= 0} /></div>}
						rightToggle={<Toggle toggled={!game.sold && this.getUserSeatIndex(userId) >= 0} onToggle={e=>this.handleGameUserToggle(e, userId)} disabled={!!game.sold || (this.getUserSeatIndex(userId) < 0 && game.seats && game.seats.length >= season.seats.length)} />}
					>{user.name}</ListItem>
				)}
					<Divider />
				</div>
			}

				<ListItem
					leftAvatar={<div><SeatAvatar sold={true} setBackgroundColor={game.sold > 0} /></div>}
					rightToggle={<Toggle toggled={!!game.sold} onToggle={e=>this.handleGameUserToggle(e, 'sold')} />}
				>Sold</ListItem>
			{game.sold &&
				<div style={{paddingLeft: 16, paddingRight: 16, paddingBottom: 16}}>
					<TextField type="number" value={game.soldPrice || 0} onChange={e=>this.handleGameChange(e, 'soldPrice')} floatingLabelText="Sold Price" fullWidth={true} />
				</div>
			}
			</List>
		);
	},
});

export const GameInfo = React.createClass({
	getDefaultProps() {
		return {
			season: {seats: [], users: []},
			game:   {seats: []},
		};
	},

	handleGameChange(e, field, value) {
		this.setState({
			game: Object.assign(this.state.game, {[field]: value !== undefined ? value : e.currentTarget.value}),
		});
	},
	handleGameDateTimeChange(type, date) {
		let $datetime = moment(date);
		if (type === 'date') {
			// prevent clearing the existing time
			$datetime = moment($datetime.format('YYYY-MM-DD') + ' ' + moment(this.props.game.datetime).format('h:mma'), 'YYYY-MM-DD h:mma');
		}
		this.handleGameChange(null, 'datetime', $datetime.format());
	},

	render() {
		return (
			<List>
				<div style={{paddingLeft: 16, paddingRight: 16, paddingBottom: 16}}>
					<TextField value={this.props.game.opponent} onChange={e=>this.handleGameChange(e, 'opponent')} floatingLabelText="Opponent" fullWidth={true} />
					<DatePicker value={moment(this.props.game.datetime).toDate()} onChange={(e, date)=>this.handleGameDateTimeChange('date', date)} formatDate={date=>moment(date).format('ddd, MMM D, YYYY')} floatingLabelText="Date" autoOk={true} style={{display: 'inline-flex', width: '50%'}} />
					<TimePicker value={moment(this.props.game.datetime).toDate()} onChange={(e, date)=>this.handleGameDateTimeChange('time', date)}  floatingLabelText="Time" autoOk={true} pedantic={true} style={{display: 'inline-flex', width: '50%'}} />
				</div>
			</List>
		);
	},
});
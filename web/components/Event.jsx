import React from 'react';

import moment from 'moment';
import firebase from '../utils/firebase';

import {List, ListItem} from 'material-ui/List';
import {ListContainer} from './helpers/material-ui';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Toggle from 'material-ui/Toggle';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import TextField from 'material-ui/TextField';

import SeatAvatar from './SeatAvatar';


export const Event = React.createClass({
	getDefaultProps() {
		return {
			season: {},
			event:  {},
			handleChanges: () => {},
		};
	},

	getUserSeat(userId) {
		if (this.props.event && this.props.event.seats) {
			for (let seatId in this.props.event.seats) {
				if (this.props.event.seats[seatId] === userId) return seatId;
			}
		}
		return null;
	},
	handleEventUserToggle(e, userId) {
		if (userId === 'sold') {
			let sold;

			if (e.currentTarget.checked) {
				sold = true;
			} else {
				sold = null;
			}
			this.props.handleChanges('event', {sold});
		} else {
			let seats = {...this.props.event.seats};

			if (e.currentTarget.checked) {
				let nextSeatId;
				for(let seatId in this.props.season.seats) {
					if (!seats[seatId]) nextSeatId = seatId;
				}
				if (nextSeatId) seats[nextSeatId] = userId;
				else throw new Error('No seats left to claim');
			} else {
				delete seats[this.getUserSeat(userId)];
			}
			this.props.handleChanges('event', {seats});
		}
	},

	render() {
		let {season, event} = this.props;
		let users       = firebase.toArray(season.users),
		    seasonSeats = firebase.toArray(season.seats),
		    eventSeats  = firebase.toArray(event.seats);

		return (
			<List>
			{!event.sold &&
				<div>
					<Subheader style={{display: 'flex', justifyContent: 'space-between', paddingRight: 16}}>
						<span>Attendees</span>
						<span>{!event.sold ? eventSeats.length : 0} / {seasonSeats.length}</span>
					</Subheader>
				{users.filter(user => user.isActive || this.getUserSeat(user.$id)).map(user =>
					<ListItem
						key={user.$id}
						leftAvatar={<div><SeatAvatar user={user} setBackgroundColor={!event.sold && this.getUserSeat(user.$id)} /></div>}
						rightToggle={<Toggle toggled={!event.sold && !!this.getUserSeat(user.$id)} onToggle={e=>this.handleEventUserToggle(e, user.$id)} disabled={!!event.sold || (!this.getUserSeat(user.$id) && eventSeats.length >= seasonSeats.length)} />}
						primaryText={user.name}
					/>
				)}
					<Divider />
				</div>
			}

				<ListItem
					leftAvatar={<div><SeatAvatar sold setBackgroundColor={!!event.sold} /></div>}
					rightToggle={<Toggle toggled={!!event.sold} onToggle={e=>this.handleEventUserToggle(e, 'sold')} />}
					primaryText="Sold"
				/>
			{event.sold &&
				<ListContainer>
					<TextField
						value={event.soldPrice || ''}
						onChange={e=>this.props.handleChanges('event', {soldPrice: e.currentTarget.value})}
						floatingLabelText="Sold Price"
						fullWidth
						type="number"
					/>
				</ListContainer>
			}

				<Divider />
				<ListContainer>
					<TextField
						value={this.props.event.notes || ''}
						onChange={e=>this.props.handleChanges('event', {notes: e.currentTarget.value})}
						floatingLabelText="Notes"
						multiLine
						fullWidth
					/>
				</ListContainer>
			</List>
		);
	},
});

export const EventInfo = React.createClass({
	getDefaultProps() {
		return {
			season: {},
			event:  {},
			handleChanges: () => {},
		};
	},

	handleEventDateTimeChange(type, date) {
		let $datetime = moment(date);
		if (type === 'date') {
			// prevent clearing the existing time
			$datetime = moment($datetime.format('YYYY-MM-DD') + ' ' + moment(this.props.event.datetime).format('h:mma'), 'YYYY-MM-DD h:mma');
		}
		this.props.handleChanges('event', {datetime: $datetime.format()});
	},

	render() {
		return (
			<List>
				<ListContainer>
					<TextField
						value={this.props.event.opponent || ''}
						onChange={e=>this.props.handleChanges('event', {opponent: e.currentTarget.value})}
						floatingLabelText="Opponent"
						fullWidth
					/>
					<DatePicker
						value={moment(this.props.event.datetime).toDate()}
						onChange={(e, date)=>this.handleEventDateTimeChange('date', date)}
						formatDate={date=>moment(date).format('ddd, MMM D, YYYY')}
						floatingLabelText="Date"
						autoOk
						style={{display: 'inline-flex', width: '50%'}}
					/>
					<TimePicker
						value={moment(this.props.event.datetime).toDate()}
						onChange={(e, date)=>this.handleEventDateTimeChange('time', date)}
						floatingLabelText="Time"
						autoOk
						pedantic
						style={{display: 'inline-flex', width: '50%'}}
					/>
				</ListContainer>
			</List>
		);
	},
});
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


export const Game = React.createClass({
	getDefaultProps() {
		return {
			season: {},
			game:   {},
			handleChanges: () => {},
		};
	},

	getUserSeat(userId) {
		if (this.props.game && this.props.game.seats) {
			for (let seatId in this.props.game.seats) {
				if (this.props.game.seats[seatId] === userId) return seatId;
			}
		}
		return null;
	},
	handleGameUserToggle(e, userId) {
		if (userId === 'sold') {
			let sold;

			if (e.currentTarget.checked) {
				sold = true;
			} else {
				sold = null;
			}
			this.props.handleChanges('game', {sold});
		} else {
			let seats = {...this.props.game.seats};

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
			this.props.handleChanges('game', {seats});
		}
	},

	render() {
		let {season, game} = this.props;
		let users       = firebase.toArray(season.users),
		    seasonSeats = firebase.toArray(season.seats),
		    gameSeats   = firebase.toArray(game.seats);

		return (
			<List>
			{!game.sold &&
				<div>
					<Subheader style={{display: 'flex', justifyContent: 'space-between', paddingRight: 16}}>
						<span>Attendees</span>
						<span>{!game.sold ? gameSeats.length : 0} / {seasonSeats.length}</span>
					</Subheader>
				{users.filter(user => user.isActive || this.getUserSeat(user.$id)).map(user => 
					<ListItem
						key={user.$id}
						leftAvatar={<div><SeatAvatar user={user} setBackgroundColor={!game.sold && this.getUserSeat(user.$id)} /></div>}
						rightToggle={<Toggle toggled={!game.sold && !!this.getUserSeat(user.$id)} onToggle={e=>this.handleGameUserToggle(e, user.$id)} disabled={!!game.sold || (!this.getUserSeat(user.$id) && gameSeats.length >= seasonSeats.length)} />}
						primaryText={user.name}
					/>
				)}
					<Divider />
				</div>
			}

				<ListItem
					leftAvatar={<div><SeatAvatar sold setBackgroundColor={!!game.sold} /></div>}
					rightToggle={<Toggle toggled={!!game.sold} onToggle={e=>this.handleGameUserToggle(e, 'sold')} />}
					primaryText="Sold"
				/>
			{game.sold &&
				<ListContainer>
					<TextField
						value={game.soldPrice || ''}
						onChange={e=>this.props.handleChanges('game', {soldPrice: e.currentTarget.value})}
						floatingLabelText="Sold Price"
						fullWidth
						type="number"
					/>
				</ListContainer>
			}

				<Divider />
				<ListContainer>
					<TextField
						value={this.props.game.notes || ''}
						onChange={e=>this.props.handleChanges('game', {notes: e.currentTarget.value})}
						floatingLabelText="Notes"
						multiLine
						fullWidth
					/>
				</ListContainer>
			</List>
		);
	},
});

export const GameInfo = React.createClass({
	getDefaultProps() {
		return {
			season: {},
			game:   {},
			handleChanges: () => {},
		};
	},

	handleGameDateTimeChange(type, date) {
		let $datetime = moment(date);
		if (type === 'date') {
			// prevent clearing the existing time
			$datetime = moment($datetime.format('YYYY-MM-DD') + ' ' + moment(this.props.game.datetime).format('h:mma'), 'YYYY-MM-DD h:mma');
		}
		this.props.handleChanges('game', {datetime: $datetime.format()});
	},

	render() {
		return (
			<List>
				<ListContainer>
					<TextField
						value={this.props.game.opponent || ''}
						onChange={e=>this.props.handleChanges('game', {opponent: e.currentTarget.value})}
						floatingLabelText="Opponent"
						fullWidth
					/>
					<DatePicker
						value={moment(this.props.game.datetime).toDate()}
						onChange={(e, date)=>this.handleGameDateTimeChange('date', date)}
						formatDate={date=>moment(date).format('ddd, MMM D, YYYY')}
						floatingLabelText="Date"
						autoOk
						style={{display: 'inline-flex', width: '50%'}}
					/>
					<TimePicker
						value={moment(this.props.game.datetime).toDate()}
						onChange={(e, date)=>this.handleGameDateTimeChange('time', date)}
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
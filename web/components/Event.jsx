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
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import SeatAvatar from './SeatAvatar';


export const Event = React.createClass({
	getDefaultProps() {
		return {
			season: {},
			event:  {},
			handleChanges: () => {},
		};
	},

	getSeatedUserId(seatId) {
		if (this.props.event && this.props.event.seats) {
			return this.props.event.seats[seatId];
		}
	},
	getUser(userId) {
		if (this.props.season.users) {
			return this.props.season.users[userId];
		}
	},
	handleSeatChanges(e, seatId, value) {
		let seats = {...this.props.event.seats};

		seats[seatId] = value || null;

		this.props.handleChanges('event', {seats});
	},

	render() {
		let {season, event} = this.props;
		let users       = firebase.toArray(season.users),
		    seasonSeats = firebase.toArray(season.seats),
		    eventSeats  = firebase.toArray(event.seats);

		return (
			<List>
			{!event.sold && seasonSeats.map(seat => {
				const userId = this.getSeatedUserId(seat.$id),
				      user   = this.getUser(userId);

				return (
				<ListItem
					key={seat.$id}
					leftIcon={<div><SeatAvatar data={user} setBackgroundColor={!!user} /></div>}
					primaryText={
						<div style={{marginTop: -10, marginBottom: -10}}>
							<SelectField
								value={event.seats && event.seats[seat.$id]}
								onChange={(e,i,value)=>this.handleSeatChanges(e, seat.$id, value)}
								hintText={`Section ${seat.section}, Row ${seat.row}, Seat ${seat.seat}`}
								fullWidth
							>
							{users.map(user =>
								<MenuItem key={user.$id} value={user.$id} primaryText={user.name} />
							)}
								<Divider />
								<MenuItem value={null} primaryText={<em>Clear seat</em>} />
							</SelectField>
						</div>
					}
					disabled
				/>
				);
			})}
				<Divider />
				<ListItem
					leftAvatar={<div><SeatAvatar sold data={event} setBackgroundColor={!!event.sold} /></div>}
					rightToggle={<Toggle toggled={!!event.sold} onToggle={e=>this.props.handleChanges('event', {sold: e.currentTarget.checked || null})} />}
					primaryText="Sold"
				/>
			{event.sold &&
				<ListContainer>
					<TextField
						value={event.soldPrice || ''}
						onChange={e=>this.props.handleChanges('event', {soldPrice: e.currentTarget.value || null})}
						floatingLabelText="Money Recouped"
						fullWidth
						type="number"
					/>
					<TextField
						value={event.soldTo || ''}
						onChange={e=>this.props.handleChanges('event', {soldTo: e.currentTarget.value || null})}
						floatingLabelText="Sold To"
						fullWidth
					/>
					<SelectField
						value={event.soldPaidTo || ''}
						onChange={(e,i,value)=>this.props.handleChanges('event', {soldPaidTo: value || null})}
						floatingLabelText="Paid To"
						fullWidth
					>
					{users.map(user =>
						<MenuItem key={user.$id} value={user.$id} primaryText={user.name} />
					)}
						<Divider />
						<MenuItem value={null} primaryText={<em>Clear user</em>} />
					</SelectField>
				</ListContainer>
			}
				<Divider />
				<ListContainer>
					<TextField
						value={this.props.event.notes || ''}
						onChange={e=>this.props.handleChanges('event', {notes: e.currentTarget.value || null})}
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
						onChange={e=>this.props.handleChanges('event', {opponent: e.currentTarget.value || null})}
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
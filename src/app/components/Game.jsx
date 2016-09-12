import React from 'react';

import moment from 'moment';
import fire from '../utils/firebase';

import {List, ListItem} from 'material-ui/List';
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

	getUserSeatIndex(userId) {
		return this.props.game.seats ? this.props.game.seats.indexOf(userId) : -1;
	},
	handleGameUserToggle(e, userId) {
		if (userId === 'sold') {
			let sold, soldPrice;

			if (e.currentTarget.checked) {
				sold = true;
				soldPrice = this.props.game.soldPrice || prompt('How much did they sell for?');
			} else {
				sold = false;
			}
			this.props.handleChanges('game', {sold, soldPrice: parseFloat(soldPrice) || null});
		} else {
			let seats = [].concat(this.props.game.seats || []);

			if (e.currentTarget.checked) {
				seats.push(userId);
			} else {
				seats.splice(this.getUserSeatIndex(userId), 1);
			}
			this.props.handleChanges('game', {seats: seats});
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
						<span>{!game.sold && game.seats ? game.seats.length : 0} / {season.seats ? season.seats.length : 0}</span>
					</Subheader>
				{season.users && season.users.map((user, userId) => 
					<ListItem
						key={userId}
						leftAvatar={<div><SeatAvatar user={user} setBackgroundColor={!game.sold && this.getUserSeatIndex(userId) >= 0} /></div>}
						rightToggle={<Toggle toggled={!game.sold && this.getUserSeatIndex(userId) >= 0} onToggle={e=>this.handleGameUserToggle(e, userId)} disabled={!!game.sold || (this.getUserSeatIndex(userId) < 0 && game.seats && season.seats && game.seats.length >= season.seats.length)} />}
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
					<TextField value={game.soldPrice || 0} onChange={e=>this.props.handleChanges('game', {soldPrice: e.currentTarget.value})} floatingLabelText="Sold Price" fullWidth={true} type="number" />
				</div>
			}

				<Divider />
				<div style={{paddingLeft: 16, paddingRight: 16, paddingBottom: 16}}>
					<TextField value={this.props.game.notes || ''} onChange={e=>this.props.handleChanges('game', {notes: e.currentTarget.value})} floatingLabelText="Notes" multiLine={true} fullWidth={true} />
				</div>
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
				<div style={{paddingLeft: 16, paddingRight: 16, paddingBottom: 16}}>
					<TextField value={this.props.game.opponent || ''} onChange={e=>this.props.handleChanges('game', {opponent: e.currentTarget.value})} floatingLabelText="Opponent" fullWidth={true} />
					<DatePicker value={moment(this.props.game.datetime).toDate()} onChange={(e, date)=>this.handleGameDateTimeChange('date', date)} formatDate={date=>moment(date).format('ddd, MMM D, YYYY')} floatingLabelText="Date" autoOk={true} style={{display: 'inline-flex', width: '50%'}} />
					<TimePicker value={moment(this.props.game.datetime).toDate()} onChange={(e, date)=>this.handleGameDateTimeChange('time', date)}  floatingLabelText="Time" autoOk={true} pedantic={true} style={{display: 'inline-flex', width: '50%'}} />
				</div>
			</List>
		);
	},
});
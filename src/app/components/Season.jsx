import React from 'react';
import {Link} from 'react-router';

import moment from 'moment';
import firebase from '../utils/firebase';

import {Tabs, Tab} from 'material-ui/Tabs';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import Avatar from 'material-ui/Avatar';
import ChevronRightIcon from 'material-ui/svg-icons/navigation/chevron-right';
import AddIcon from 'material-ui/svg-icons/content/add';

import GameItem from './GameItem';
import SeatAvatar from './SeatAvatar';


export const Season = React.createClass({
	getDefaultProps() {
		return {
			season: {},
			games:  {},
		};
	},

	groupGamesByMonth() {
		let gamesByMonth = [],
			previousMonthId;
		firebase.toArray(this.props.games[this.props.params.seasonId]).map(game => {
			game.$datetime = moment(game.datetime);

			let monthId = game.$datetime.format('YYYY-MM');
			if (monthId !== previousMonthId) {
				gamesByMonth.push([]);
				previousMonthId = monthId;
			}
			gamesByMonth[gamesByMonth.length - 1].push(game);
		});
		return gamesByMonth;
	},

	render() {
		return (
			<List>
			{this.groupGamesByMonth().map((games, monthIndex) =>
				<div key={monthIndex}>
					<Subheader>{games[0].$datetime.format('MMMM')} {games[0].$datetime.format('M') === '1' && games[0].$datetime.format('YYYY')}</Subheader>
					{games.map(game => 
					<GameItem
						key={game.$id}
						game={game}
						season={this.props.season}
						containerElement={<Link to={'/season/' + this.props.params.seasonId + '/game/' + game.$id} />}
					/>
					)}
				</div>
			)}
			</List>
		)
	},
});

export const SeasonInfo = React.createClass({
	getDefaultProps() {
		return {
			season: {},
			handleChanges: () => {},
		};
	},

	render() {
		return (
			<div>
				<div style={{paddingLeft: 16, paddingRight: 16, paddingBottom: 16}}>
					<TextField value={this.props.season.name || ''} onChange={e=>this.props.handleChanges('season', {name: e.currentTarget.value})} floatingLabelText="Season name" fullWidth />
					<TextField value={this.props.season.cost || ''} onChange={e=>this.props.handleChanges('season', {cost: e.currentTarget.value})} floatingLabelText="Total cost" fullWidth type="number" />
				</div>
				<Divider />
				<List>
					<Subheader>Seats</Subheader>
				{this.props.season.seats && this.props.season.seats.map((seat, seatId) =>
					<ListItem
						key={seatId}
						leftAvatar={<div><SeatAvatar /></div>}
						rightIcon={<ChevronRightIcon />}
						containerElement={<Link to={'/season/' + this.props.params.seasonId + '/edit/seat/' + seatId} />}
						primaryText={`Section ${seat.section}, Row ${seat.row}, Seat ${seat.seat}`}
					/>
				)}
				</List>
				<div style={{textAlign: 'right', padding: '0 8px 16px'}}>
					<FlatButton
						primary={true}
						containerElement={<Link to={'/season/' + this.props.params.seasonId + '/edit/seat/' + (this.props.season.seats ? this.props.season.seats.length : 0)} />}
						label="Add new seat"
					/>
				</div>
				<Divider />
				<List>
					<Subheader>Attendees</Subheader>
				{this.props.season.users && this.props.season.users.map((user, userId) =>
					<ListItem
						key={userId}
						leftAvatar={<div><SeatAvatar user={user} /></div>}
						rightIcon={<ChevronRightIcon />}
						containerElement={<Link to={'/season/' + this.props.params.seasonId + '/edit/user/' + userId} />}
						primaryText={user.name}
					/>
				)}
				</List>
				<div style={{textAlign: 'right', padding: '0 8px 16px'}}>
					<FlatButton
						primary={true}
						containerElement={<Link to={'/season/' + this.props.params.seasonId + '/edit/user/' + (this.props.season.users ? this.props.season.users.length : 0)} />}
						label="Add new attendee"
					/>
				</div>
			</div>
		)
	},
});

export const SeasonSeat = React.createClass({
	getDefaultProps() {
		return {
			seat: {},
			handleChanges: () => {},
		};
	},

	render() {
		return (
			<div>
				<div style={{padding: '0 16px 16px'}}>
					<TextField value={this.props.seat.section || ''} onChange={e=>this.props.handleChanges('seat', {section: e.currentTarget.value})} floatingLabelText="Section" fullWidth autoFocus />
					<TextField value={this.props.seat.row || ''} onChange={e=>this.props.handleChanges('seat', {row: e.currentTarget.value})} floatingLabelText="Row" fullWidth />
					<TextField value={this.props.seat.seat || ''} onChange={e=>this.props.handleChanges('seat', {seat: e.currentTarget.value})} floatingLabelText="Seat" fullWidth />
				</div>
			</div>
		)
	},
});

export const SeasonUser = React.createClass({
	getDefaultProps() {
		return {
			user: {},
			handleChanges: () => {},
		};
	},

	render() {
		return (
			<div>
				<div style={{paddingLeft: 16, paddingRight: 16, paddingBottom: 16}}>
					<TextField value={this.props.user.name || ''} onChange={e=>this.props.handleChanges('user', {name: e.currentTarget.value})} floatingLabelText="Name" fullWidth autoFocus />
				</div>
			</div>
		)
	},
});
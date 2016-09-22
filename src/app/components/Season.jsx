import React from 'react';
import {Link} from 'react-router';

import moment from 'moment';
import firebase from '../utils/firebase';

import {Tabs, Tab} from 'material-ui/Tabs';
import {List, ListItem} from 'material-ui/List';
import {ListContainer} from './helpers/material-ui';
import Subheader from 'material-ui/Subheader';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import Toggle from 'material-ui/Toggle';
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
				<ListContainer>
					<TextField
						value={this.props.season.name || ''}
						onChange={e=>this.props.handleChanges('season', {name: e.currentTarget.value})}
						floatingLabelText="Season name"
						fullWidth
					/>
					<TextField 
						value={this.props.season.cost || ''}
						onChange={e=>this.props.handleChanges('season', {cost: e.currentTarget.value})}
						floatingLabelText="Total cost"
						fullWidth
						type="number"
					/>
				</ListContainer>
				<Divider />
				<List>
					<Subheader>Seats</Subheader>
				{firebase.toArray(this.props.season.seats).map(seat =>
					<ListItem
						key={seat.$id}
						leftAvatar={<div><SeatAvatar /></div>}
						rightIcon={<ChevronRightIcon />}
						containerElement={<Link to={'/season/' + this.props.params.seasonId + '/edit/seat/' + seat.$id} />}
						primaryText={`Section ${seat.section}, Row ${seat.row}, Seat ${seat.seat}`}
					/>
				)}
				</List>
				<ListContainer style={{textAlign: 'right'}}>
					<FlatButton
						primary
						containerElement={<Link to={'/season/' + this.props.params.seasonId + '/edit/seat/' + firebase.key()} />}
						label="Add new seat"
					/>
				</ListContainer>
				<Divider />
				<List>
					<Subheader>Attendees</Subheader>
				{firebase.toArray(this.props.season.users).map(user =>
					<ListItem
						key={user.$id}
						leftAvatar={<div><SeatAvatar user={user} setBackgroundColor={!!user.isActive} /></div>}
						rightIcon={<ChevronRightIcon />}
						containerElement={<Link to={'/season/' + this.props.params.seasonId + '/edit/user/' + user.$id} />}
						primaryText={user.name}
					/>
				)}
				</List>
				<ListContainer style={{textAlign: 'right'}}>
					<FlatButton
						primary
						containerElement={<Link to={'/season/' + this.props.params.seasonId + '/edit/user/' + firebase.key()} />}
						label="Add new attendee"
					/>
				</ListContainer>
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
				<ListContainer>
					<TextField
						value={this.props.seat.section || ''}
						onChange={e=>this.props.handleChanges('seat', {section: e.currentTarget.value})}
						floatingLabelText="Section"
						fullWidth
					/>
					<TextField
						value={this.props.seat.row || ''}
						onChange={e=>this.props.handleChanges('seat', {row: e.currentTarget.value})}
						floatingLabelText="Row"
						fullWidth
					/>
					<TextField
						value={this.props.seat.seat || ''}
						onChange={e=>this.props.handleChanges('seat', {seat: e.currentTarget.value})}
						floatingLabelText="Seat"
						fullWidth
					/>
				</ListContainer>
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
			<List>
				<ListContainer>
					<TextField
						value={this.props.user.name || ''}
						onChange={e=>this.props.handleChanges('user', {name: e.currentTarget.value})}
						floatingLabelText="Name"
						fullWidth
					/>
				</ListContainer>
				<ListItem
					rightToggle={<Toggle toggled={!!this.props.user.isActive} onToggle={e=>this.props.handleChanges('user', {isActive: e.currentTarget.checked})} />}
					primaryText="Active"
				/>
			</List>
		)
	},
});
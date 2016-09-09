import React from 'react';
import moment from 'moment';

import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Toggle from 'material-ui/Toggle';
import TextField from 'material-ui/TextField';

import SeatAvatar from './SeatAvatar';

import Data from '../data';


export const Game = React.createClass({
	getDefaultProps() {
		return {
			params: {
				seasonId: 0,
				gameId: 0,
			},
		};
	},
	getInitialState() {
		return {
			season: {seats: [], users: []},
			game:   {seats: []},
		};
	},
	componentWillMount() {
		const nextProps = this.props;
		this.setState({
			season: Data.seasons[nextProps.params.seasonId],
			game:   Data['seasons:games'][nextProps.params.seasonId][nextProps.params.gameId],
		});
	},
	componentWillReceiveProps(nextProps) {
		this.setState({
			season: Data.seasons[nextProps.params.seasonId],
			game:   Data['seasons:games'][nextProps.params.seasonId][nextProps.params.gameId],
		});
	},

	getUserSeatIndex(userId) {
		return this.state.game.seats ? this.state.game.seats.indexOf(userId) : -1;
	},
	handleToggle(e, userId) {
		if (userId === 'sold') {
			let sold = this.state.game.sold + 0;
			if (e.currentTarget.checked) {
				sold = 1;
			} else {
				sold = null;
			}
			this.setState({game: Object.assign(this.state.game, {sold})});
		} else {
			let seats = [].concat(this.state.game.seats || []);
			if (e.currentTarget.checked) {
				seats.push(userId);
			} else {
				seats.splice(this.getUserSeatIndex(userId), 1);
			}
			this.setState({game: Object.assign(this.state.game, {seats})});
		}
	},

	render() {
		return (
			<List>
				<Subheader style={{display: 'flex', justifyContent: 'space-between', paddingRight: 16}}>
					<span>Attendees</span>
					<span>{!this.state.game.sold && this.state.game.seats ? this.state.game.seats.length : 0} / {this.state.season.seats.length}</span>
				</Subheader>
			{this.state.season.users.map((user, userId) => 
				<ListItem
					key={userId}
					leftAvatar={<div><SeatAvatar user={user} setBackgroundColor={!this.state.game.sold && this.getUserSeatIndex(userId) >= 0} /></div>}
					rightToggle={<Toggle toggled={!this.state.game.sold && this.getUserSeatIndex(userId) >= 0} onToggle={e=>this.handleToggle(e, userId)} disabled={!!this.state.game.sold || (this.getUserSeatIndex(userId) < 0 && this.state.game.seats && this.state.game.seats.length >= this.state.season.seats.length)} />}
				>{user.name}</ListItem>
			)}
				<Divider />
				<ListItem
					leftAvatar={<div><SeatAvatar sold={true} setBackgroundColor={this.state.game.sold > 0} /></div>}
					rightToggle={<Toggle toggled={this.state.game.sold > 0} onToggle={e=>this.handleToggle(e, 'sold')} />}
				>Sold</ListItem>
			</List>
		);
	},
});

export const GameInfo = React.createClass({
	getDefaultProps() {
		return {
			params: {
				seasonId: 0,
				gameId: 0,
			},
		};
	},
	getInitialState() {
		return {
			season: {seats: [], users: []},
			game:   {seats: []},
		};
	},
	componentWillMount() {
		const nextProps = this.props;
		this.setState({
			season: Data.seasons[nextProps.params.seasonId],
			game:   Data['seasons:games'][nextProps.params.seasonId][nextProps.params.gameId],
		});
	},
	componentWillReceiveProps(nextProps) {
		this.setState({
			season: Data.seasons[nextProps.params.seasonId],
			game:   Data['seasons:games'][nextProps.params.seasonId][nextProps.params.gameId],
		});
	},

	handleChange(e, key) {
		this.setState({game: Object.assign(this.state.game, {[key]: e.currentTarget.value})});
	},

	render() {
		return (
			<List>
				<div style={{paddingLeft: 16, paddingRight: 16, paddingBottom: 16}}>
					<TextField value={this.state.game.opponent} onChange={e=>this.handleChange(e, 'opponent')} floatingLabelText="Opponent" fullWidth={true} />
					<TextField type="datetime" value={this.state.game.datetime} onChange={e=>this.handleChange(e, 'datetime')} floatingLabelText="Date & Time" fullWidth={true} />
					<TextField type="number" value={this.state.game.sold || ''} onChange={e=>this.handleChange(e, 'sold')} floatingLabelText="Sold Price" fullWidth={true} />
				</div>
			</List>
		);
	},
});
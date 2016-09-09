import React from 'react';
import moment from 'moment';
import {Link} from 'react-router';

import {Tabs, Tab} from 'material-ui/Tabs';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';
import ChevronRightIcon from 'material-ui/svg-icons/navigation/chevron-right';
import AddIcon from 'material-ui/svg-icons/content/add';

import GameItem from './GameItem';
import SeatAvatar from './SeatAvatar';

import Data from '../data';

export const Season = React.createClass({
	getDefaultProps() {
		return {
			params: {
				seasonId: 0,
			},
		};
	},
	getInitialState() {
		return {
			season: {seats: [], users: []},
		};
	},
	componentWillMount() {
		const nextProps = this.props;
		this.setState({
			season: Data.seasons[nextProps.params.seasonId],
		});
	},
	componentWillReceiveProps(nextProps) {
		this.setState({
			season: Data.seasons[nextProps.params.seasonId],
		});
	},

	groupGamesByMonth() {
		let gamesByMonth = [],
			previousMonthId;
		Data['seasons:games'][this.props.params.seasonId].map((game, gameIndex) => {
			game.$id = gameIndex;
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
						season={this.state.season}
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
			params: {
				seasonId: 0,
			},
		};
	},
	getInitialState() {
		return {
			season: {seats: [], users: []},
		};
	},
	componentWillMount() {
		let nextProps = this.props;
		this.setState({
			season: Data.seasons[nextProps.params.seasonId],
		});
	},
	componentWillReceiveProps(nextProps) {
		this.setState({
			season: Data.seasons[nextProps.params.seasonId],
		});
	},

	render() {
		return (
			<div>
				<div style={{paddingLeft: 16, paddingRight: 16, paddingBottom: 16}}>
					<TextField value={this.state.season.name} floatingLabelText="Season name" fullWidth={true} />
					<TextField value={this.state.season.cost} floatingLabelText="Total cost" fullWidth={true} />
				</div>
				<Divider />
				<List>
					<Subheader>Seats</Subheader>
				{this.state.season.seats.map((seat, seatId) =>
					<ListItem
						key={seatId}
						leftAvatar={<div><SeatAvatar /></div>}
						rightIcon={<ChevronRightIcon />}
					>{`Section ${seat.section}, Row ${seat.row}, Seat ${seat.seat}`}</ListItem>
				)}
					<Divider inset={true} />
					<ListItem insetChildren={true} rightIcon={<AddIcon />}>Add new seat</ListItem>
				</List>
			</div>
		)
	},
});
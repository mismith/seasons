import React from 'react';
import moment from 'moment';

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

export default React.createClass({
	getDefaultProps() {
		return {
			seasonId: 0,
		};
	},
	getInitialState() {
		return {
			season: Data.seasons[this.props.seasonId],
		};
	},

	groupGamesByMonth() {
		let gamesByMonth = [],
			previousMonthId;
		Data['seasons:games'][this.props.seasonId].map((game, gameIndex) => {
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
			<Tabs>
				<Tab label="Schedule">
					<List>
					{this.groupGamesByMonth().map((games, monthIndex) =>
					<div key={monthIndex}>
						<Subheader>{games[0].$datetime.format('MMMM')} {games[0].$datetime.format('M') === '1' && games[0].$datetime.format('YYYY')}</Subheader>
						{games.map(game => 
						<GameItem key={game.$id} game={game} season={this.state.season} />
						)}
					</div>
					)}
					</List>
				</Tab>
				<Tab label="Info">
					<div style={{paddingLeft: 16, paddingRight: 16, paddingBottom: 16}}>
						<TextField defaultValue={this.state.season.name} floatingLabelText="Season name" fullWidth={true} />
						<TextField defaultValue={this.state.season.cost} floatingLabelText="Total cost" fullWidth={true} />
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
				</Tab>
			</Tabs>
		)
	},
});
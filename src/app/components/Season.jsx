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

import SeatAvatar from './SeatAvatar';

import Data from '../data';

export default React.createClass({
	getDefaultProps() {
		return {
			seasonId: 0,
		};
	},

	componentWillMount() {
		this.season = Data.seasons[this.props.seasonId];
	},

	render() {
		let gamesByMonth = [],
			previousMonthId;
		Data['seasons:data'][this.props.seasonId].games.map((game, gameId) => {
			game.$id = gameId;
			game.$datetime = moment(game.datetime);

			let monthId = game.$datetime.format('YYYY-MM');
			if (monthId !== previousMonthId) {
				gamesByMonth.push([]);
				previousMonthId = monthId;
			}
			gamesByMonth[gamesByMonth.length - 1].push(game);
		});

		return (
			<Tabs>
				<Tab label="Info">
					<div style={{paddingLeft: 16, paddingRight: 16, paddingBottom: 16}}>
						<TextField defaultValue={this.season.name} floatingLabelText="Season name" fullWidth={true} />
						<TextField defaultValue={this.season.cost} floatingLabelText="Total cost" fullWidth={true} />
					</div>
					<Divider />
					<List>
						<Subheader>Seats</Subheader>
					{this.season.seats.map((seat, seatId) =>
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
				<Tab label="Schedule">
					<List>
					{gamesByMonth.map((games, monthIndex) =>
					<div key={monthIndex}>
						<Subheader>{games[0].$datetime.format('MMMM')} {games[0].$datetime.format('M') === '1' && games[0].$datetime.format('YYYY')}</Subheader>
						{games.map(game => 
						<ListItem
							key={game.$id}
							primaryText={game.opponent}
							secondaryText={game.$datetime.format('h:mma, ddd, MMM D, YYYY')}
							leftAvatar={<Avatar>{game.$datetime.format('D')}</Avatar>}
							rightAvatar={<div style={{display: 'inline-flex', marginTop: 6}}>
							{Data.seasons[this.props.seasonId].seats.map((seat, seatId) => 
								<SeatAvatar key={seatId} info={seat} data={(Data['seasons:data'][this.props.seasonId].seats[game.$id] || [])[seatId]} game={game} style={{margin: 1}} />
							)}
							</div>}
							innerDivStyle={{paddingRight: 56 + 12 + 32 * (Data.seasons[this.props.seasonId].seats.length - 1)}}
						/>
						)}
					</div>
					)}
					</List>
				</Tab>
			</Tabs>
		)
	},
});
import React from 'react';
import moment from 'moment';

import {Tabs, Tab} from 'material-ui/Tabs';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';

import Data from '../data';
import SeatAvatar from './SeatAvatar';

const Home = React.createClass({
	getDefaultProps() {
		return {
			seasonId: 0,
		};
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
								<SeatAvatar key={seatId} info={seat} data={(Data['seasons:data'][this.props.seasonId].seats[game.$id] || [])[seatId]} game={game} />
							)}
							</div>}
							innerDivStyle={{paddingRight: 56 + 12 + 32 * (Data.seasons[this.props.seasonId].seats.length - 1)}}
						/>
						)}
					</div>
					)}
					</List>
				</Tab>
				<Tab label="Stats">
					<Subheader>Stats will go here.</Subheader>
				</Tab>
			</Tabs>
		)
	},
});

export default Home;
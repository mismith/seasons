import React from 'react';

import moment from 'moment';

import {ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

import SeatAvatar from './SeatAvatar';

export default React.createClass({
	getDefaultProps() {
		return {
			season: {},
			game: {},
			showDayAvatar: true,
		};
	},

	render() {
		let {game, season, showDayAvatar, ...props} = this.props;
		game.$datetime = game.$datetime || moment(game.datetime);

		return (
			<ListItem
				primaryText={game.opponent}
				secondaryText={game.$datetime.format('h:mma, ddd, MMM D, YYYY')}
				leftAvatar={showDayAvatar ? <Avatar>{game.$datetime.format('D')}</Avatar> : null}
				rightAvatar={<div style={{display: 'inline-flex', marginTop: 6}}>
				{season.seats.map((seat, seatId) => 
					<SeatAvatar key={seatId} size={30} user={game.seats && game.seats[seatId] !== undefined ? season.users[game.seats[seatId]] : undefined} sold={game.sold} />
				)}
				</div>}
				innerDivStyle={{paddingRight: 56 + 12 + 32 * (season.seats.length - 1)}}
				{...props}
			/>
		)
	},
});
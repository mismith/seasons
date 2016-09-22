import React from 'react';

import firebase from '../utils/firebase';
import formatDate from './helpers/formatDate';

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
		let seasonSeats = firebase.toArray(season.seats);
		return (
			<ListItem
				primaryText={game.opponent + (game.notes ? ' 📝' : '')}
				secondaryText={formatDate(game.datetime)}
				leftAvatar={showDayAvatar ? <Avatar>{game.$datetime.format('D')}</Avatar> : null}
				rightAvatar={<div style={{display: 'inline-flex', marginTop: 6}}>
				{seasonSeats.map(seat => 
					<SeatAvatar key={seat.$id} size={30} user={season.users && game.seats && game.seats[seat.$id] ? season.users[game.seats[seat.$id]] : undefined} sold={game.sold} />
				)}
				</div>}
				innerDivStyle={{paddingRight: 56 + 12 + 32 * (seasonSeats.length ? seasonSeats.length - 1 : 0)}}
				{...props}
			/>
		)
	},
});
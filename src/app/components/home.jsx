import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {user} from '../actions/firebase';
import moment from 'moment';

import Loading from '../components/helpers/loading';
import LogoImg from '../images/logo.svg';
import SeatIcon from '../images/seat.svg';

import data from '../data.js';

const Home = React.createClass({
	render() {
		return (
			<div>
				<h1>Seasons</h1>
				<pre>{JSON.stringify(this.props.currentUser, null, 4)}</pre>
				<img src={LogoImg} />
				<Loading />

				<ul>
				{data.games.map((game, gameId) =>
					<li key={gameId}>
						<time title={game.datetime}>{moment(game.datetime).format('YYYY-MM-DD')}</time>
						<div>{game.opponent}</div>
						<ul>
						{data.seats.map((seat, seatId) => 
							<li key={seatId}>
								{seat.seat}
								{data['games:seats'][gameId][seatId].type}
								{data['games:seats'][gameId][seatId].type === 'user' ? data.users[data['games:seats'][gameId][seatId].userId].name : ''}
								{data['games:seats'][gameId][seatId].type === 'sale' ? '$' + parseFloat(data['games:seats'][gameId][seatId].price).toFixed(2) : ''}
							</li>
						)}
						</ul>
					</li>
				)}
				</ul>
			</div>
		)
	},
});

function mapStateToProps(state){
	return {
		currentUser: state.currentUser,
	};
}
function mapDispatchToProps(dispatch){
	return bindActionCreators({
		user,
	}, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Home);
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {user} from '../actions/firebase';
import moment from 'moment';

import Loading from '../components/helpers/loading';
import LogoImg from '../images/logo.svg';
import SeatIcon from '../images/seat.svg';

import data from '../data.js';


import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

const Seat = React.createClass({
	getDefaultProps() {
		return {
			info: {},
			data: {},
			game: {},
		};
	},
	render() {
		let backgroundColor;
		if (this.props.data.type === 'sale') {
			if (this.props.data.sold) {
				backgroundColor = '#6CB132';
			} else {
				if (moment().isBefore(this.props.game.datetime)) {
					backgroundColor = '#FFCC39';
				} else {
					backgroundColor = '#C83E31';
				}
			}
		} else if(this.props.data.type === 'user') {
			if (this.props.data.userId !== undefined) {
				backgroundColor = '#5176C7';
			}
		}
		return (
			<Avatar size={30} backgroundColor={backgroundColor} style={{margin: 1}}>
			{this.props.data.userId !== undefined ?
				<span>{data.users[this.props.data.userId].name.replace(/(^| )([a-z])[a-z-]+/ig, '$2')}</span>
			:
				<img src={SeatIcon} height="18" style={{opacity: .5}} />
			}
			</Avatar>
		);
	},
});

const Home = React.createClass({
	render() {
		return (
			<div>
				<List>
				{data.games.map((game, gameId) => {
					let d = moment(game.datetime);
					return (
						<ListItem
							key={gameId}
							primaryText={game.opponent}
							secondaryText={d.format('h:mma, ddd, MMM D, YYYY')}
							leftAvatar={<Avatar className="avatar-calendar">
								<div>{d.format('MMM')}</div>
								<div>{d.format('D')}</div>
							</Avatar>}
							rightAvatar={<div style={{display: 'inline-flex', marginTop: 6}}>
							{data.seats.map((seat, seatId) => 
								<Seat key={seatId} info={seat} data={data['games:seats'][gameId][seatId]} game={game} />
							)}
							</div>}
							innerDivStyle={{paddingRight: 56 + 12 + 32 * (data.seats.length - 1)}}
						/>
					)
				})}
				</List>

				<img src={LogoImg} />
				<Loading />
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
import React from 'react';
import moment from 'moment';

import Avatar from 'material-ui/Avatar';

import SeatIcon from '../images/seat.svg';
import Data from '../data.js';

const SeatAvatar = React.createClass({
	getDefaultProps() {
		return {
			info: {},
			data: {},
			game: {},
		};
	},
	getBackgroundColor() {
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
		return backgroundColor;
	},
	render() {
		return (
			<Avatar size={30} backgroundColor={this.getBackgroundColor()} style={{margin: 1}}>
			{this.props.data.userId !== undefined ?
				Data.users[this.props.data.userId].name.replace(/(^| )([a-z])[a-z-]+/ig, '$2') :
				<img src={SeatIcon} height="18" style={{opacity: .5}} />
			}
			</Avatar>
		);
	},
});
export default SeatAvatar;
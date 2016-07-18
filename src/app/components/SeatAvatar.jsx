import React from 'react';
import moment from 'moment';
import initialize from './helpers/initialize';

import Avatar from 'material-ui/Avatar';

import SeatIcon from '../images/seat.svg';
import Data from '../data.js';

const SeatAvatar = React.createClass({
	getDefaultProps() {
		return {
			info: {},
			data: {},
			game: {},
			size: 30,
		};
	},
	getBackgroundColor() {
		let backgroundColor;
		if (this.props.data.sold) {
			backgroundColor = '#6CB132';
		} else if (this.props.data.userId !== undefined) {
			backgroundColor = '#5176C7';
		}
		return backgroundColor;
	},
	render() {
		return (
			<Avatar size={this.props.size} backgroundColor={this.getBackgroundColor()}>
			{this.props.data.userId !== undefined ?
				initialize(Data.users[this.props.data.userId].name) :
				<img src={SeatIcon} height="18" style={{opacity: .5}} />
			}
			</Avatar>
		);
	},
});
export default SeatAvatar;
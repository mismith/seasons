import React from 'react';
import moment from 'moment';
import getInitials from './helpers/getInitials';

import Avatar from 'material-ui/Avatar';

import SeatIcon from '../images/seat.svg';

const SeatAvatar = React.createClass({
	getDefaultProps() {
		return {
			sold: false,
			user: undefined,
			size: undefined,
			setBackgroundColor: true,
		};
	},
	getBackgroundColor() {
		let backgroundColor;
		if (this.props.setBackgroundColor) {
			if (this.props.sold) {
				return '#6CB132';
			} else if (this.props.user) {
				return '#5176C7';
			}
		}
		return;
	},
	render() {
		let {size, sold, user, props, backgroundColor} = this.props;
		return (
			<Avatar size={size} backgroundColor={this.getBackgroundColor()} {...props}>
			{sold &&
				<span>$</span>
			}
			{!sold && user &&
				getInitials(user.name) 
			}
			{!sold && !user &&
				<img src={SeatIcon} height="18" style={{opacity: .5}} />
			}
			</Avatar>
		);
	},
});
export default SeatAvatar;
import React from 'react';

import getInitials from '../utils/getInitials';

import Avatar from 'material-ui/Avatar';

import SeatIcon from '../images/seat.svg';

const SeatAvatar = React.createClass({
	getDefaultProps() {
		return {
			sold: false,
			data: undefined,
			size: undefined,
			setBackgroundColor: true,
		};
	},
	getBackgroundColor(setBackgroundColor) {
		if (setBackgroundColor) {
			if (this.props.sold) {
				if (this.props.data) {
					if (this.props.data.soldPrice && this.props.data.soldTo && this.props.data.soldPaidTo) {
						return '#6CB132';
					} else if (this.props.data.soldPrice || this.props.data.soldTo || this.props.data.soldPaidTo) {
						return '#FFCC39';
					}
				}
				return '#C83E31';
			} else if (this.props.data) {
				return '#5176C7';
			}
		}
		return;
	},
	render() {
		let {size, sold, data, setBackgroundColor, ...props} = this.props;
		return (
			<Avatar size={size} backgroundColor={this.getBackgroundColor(setBackgroundColor)} {...props}>
			{sold &&
				<span>$</span>
			}
			{!sold && data &&
				getInitials(data.name) 
			}
			{!sold && !data &&
				<img src={SeatIcon} height="18" role="presentation" style={{opacity: .5}} />
			}
			</Avatar>
		);
	},
});
export default SeatAvatar;
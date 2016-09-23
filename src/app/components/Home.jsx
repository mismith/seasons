import React from 'react';
import {browserHistory} from 'react-router';

import firebase from '../utils/firebase';

import GoogleGIcon from '../images/googleg.svg';
import LogoImg from '../images/logo.svg';

import SwipeableViews from 'react-swipeable-views';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import Toggle from 'material-ui/Toggle';
import SeatAvatar from './SeatAvatar';

import RaisedButton from 'material-ui/RaisedButton';
import Loader from './helpers/Loader';

const styles = {
	centered: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
	slide: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		height: '100%',
	},
};

export const Home = React.createClass({
	getInitialState() {
		return {
			slideIndex: 0,
		};
	},
	render() {
		return (
			<div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-around', flexGrow: 1}}>
				<div>
					<h1 style={{marginTop: 0}}>Seasons</h1>
					<SwipeableViews
						onChangeIndex={index=>this.setState({slideIndex: index})}
					>
						<div className="slide" style={styles.slide}>
							<img src={LogoImg} />
							<h3>Track your season tickets</h3>
						</div>
						<div className="slide" style={styles.slide}>
							<Paper>
								<List>
									<ListItem
										leftAvatar={<div><SeatAvatar user={{name: 'John Smith'}} /></div>}
										rightToggle={<Toggle defaultToggled={true} />}
										primaryText="John Smith"
									/>
									<ListItem
										leftAvatar={<div><SeatAvatar user={{name: 'Jane Doe'}} /></div>}
										rightToggle={<Toggle defaultToggled={true} />}
										primaryText="Jane Doe"
									/>
									<ListItem
										leftAvatar={<div><SeatAvatar user={{name: 'Sam Smith'}} /></div>}
										rightToggle={<Toggle defaultToggled={false} />}
										primaryText="Sam Smith"
									/>
								</List>
							</Paper>
							<h3>Record who attends each game</h3>
						</div>
						<div className="slide" style={styles.slide}>
							<Paper>
								<List>
									<ListItem
										leftAvatar={<div><SeatAvatar sold /></div>}
										rightToggle={<Toggle defaultToggled={true} />}
										primaryText="Sold"
									/>
								</List>
							</Paper>
							<h3>Log which tickets you sell</h3>
						</div>
					</SwipeableViews>
					<br />
					<div className="dots">
					{[0,1, 2].map(index => 
						<span key={index} className={'dot' + (this.state.slideIndex === index ? ' active' : '')} />
					)}
					</div>
				</div>
			{!this.props.me &&
				<div style={{textAlign: 'center', paddingBottom: 32}}>
				{this.props.authLoaded ?
					<RaisedButton
						label="Login with Google"
						icon={<img src={GoogleGIcon} style={{marginTop: -2}} />}
						onTouchTap={firebase.login}
					/>
				:
					<Loader />
				}
				</div>
			}
			</div>
		)
	}
});


export function HomeRedirect(nextState, replace, callback) {
	firebase.auth().onAuthStateChanged(me => {
		if (me) {
			replace('/season/-KRGF6NbHPrSyljL3m3r'); // @TODO: get dynamic season id
		}
		callback();
	});
}
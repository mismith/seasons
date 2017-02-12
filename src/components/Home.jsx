import React from 'react';

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
import {ListItemPicker} from './helpers/material-ui';

import './Home.css';


export const Home = React.createClass({
  getInitialState() {
    return {
      slideIndex: 0,
    };
  },
  render() {
    const fakeUsers = [
      {$id: 0, name: 'John Smith'},
      {$id: 1, name: 'Jane Doe'},
      {$id: 2, name: 'Sam Smith'},
    ];

    return (
      <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'stretch', flexGrow: 1}}>
          <h1 style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1}}>Seasons</h1>
          <SwipeableViews
            index={this.state.slideIndex}
            onChangeIndex={index=>this.setState({slideIndex: index})}
            style={{flexGrow: 1}}
          >
            <div>
              <h3>Track your season tickets</h3>
              <div style={{textAlign: 'center'}}>
                <img src={LogoImg} role="presentation" />
              </div>
            </div>
            <div>
              <h3>Record who attends each event</h3>
              <Paper>
                <List>
                  <ListItemPicker
                    leftIcon={<div><SeatAvatar data={fakeUsers[0]} setBackgroundColor={!!fakeUsers[0]} /></div>}
                    items={fakeUsers}
                    value={0}
                  />
                  <ListItemPicker
                    leftIcon={<div><SeatAvatar data={fakeUsers[1]} setBackgroundColor={!!fakeUsers[1]} /></div>}
                    items={fakeUsers}
                    value={1}
                  />
                </List>
              </Paper>
            </div>
            <div>
              <h3>Log which tickets you sell</h3>
              <Paper>
                <List>
                  <ListItem
                    leftAvatar={<div><SeatAvatar sold /></div>}
                    rightToggle={<Toggle defaultToggled={true} />}
                    primaryText="Sold"
                  />
                </List>
              </Paper>
            </div>
            <div>
              <h3>Simply login to get started</h3>
              <div style={{textAlign: 'center'}}>
                <img src={LogoImg} role="presentation" />
              </div>
            </div>
          </SwipeableViews>
          <div className="dots">
          {[0,1,2,3].map(index => 
            <span
              key={index}
              onClick={e=>this.setState({slideIndex: index})}
              className={'dot' + (this.state.slideIndex === index ? ' active' : '')}
            />
          )}
          </div>
        </div>
      {!this.props.me &&
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', padding: 32, flexGrow: 1}}>
        {this.props.authLoaded ?
          <RaisedButton
            label="Login with Google"
            icon={<img src={GoogleGIcon} alt="Google Logo" style={{marginTop: -2}} />}
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
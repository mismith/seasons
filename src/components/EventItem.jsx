import React from 'react';

import firebase from '../utils/firebase';
import formatDate from '../utils/formatDate';

import {ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

import SeatAvatar from './SeatAvatar';

export default React.createClass({
  getDefaultProps() {
    return {
      season: {},
      event:  {},
      showDayAvatar: true,
    };
  },

  render() {
    let {event, season, showDayAvatar, ...props} = this.props;
    let seasonSeats = firebase.toArray(season.seats);
    return (
      <ListItem
        primaryText={event.opponent + (event.notes ? ' 📝' : '')}
        secondaryText={formatDate(event.datetime)}
        leftAvatar={showDayAvatar ? <Avatar>{event.$datetime.format('D')}</Avatar> : null}
        rightAvatar={<div style={{display: 'inline-flex', marginTop: 6}}>
        {seasonSeats.map(seat => 
          <SeatAvatar key={seat.$id} size={30} data={event.sold ? event : (season.attendees && event.seats && event.seats[seat.$id] && season.attendees[event.seats[seat.$id]])} sold={event.sold} />
        )}
        </div>}
        innerDivStyle={{paddingRight: 56 + 12 + 32 * (seasonSeats.length ? seasonSeats.length - 1 : 0)}}
        {...props}
      />
    )
  },
});
import React from 'react';

import moment from 'moment';
import firebase from '../utils/firebase';

import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Toggle from 'material-ui/Toggle';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import TextField from 'material-ui/TextField';

import {ListContainer, ListItemPicker} from './helpers/material-ui';
import SeatAvatar from './SeatAvatar';

export const Event = React.createClass({
  getDefaultProps() {
    return {
      season: {},
      event:  {},
      handleChanges: () => {},
    };
  },

  getSeatedAttendeeId(seatId) {
    if (this.props.event && this.props.event.seats) {
      return this.props.event.seats[seatId];
    }
  },
  getAttendee(attendeeId, attendees = undefined) {
    if (attendees) {
      return attendees.find(attendee => attendee && attendee.$id === attendeeId);
    }
    if (this.props.season.attendees) {
      return this.props.season.attendees[attendeeId];
    }
  },
  handleSeatChanges(e, seatId, value) {
    let seats = {...this.props.event.seats};

    if (value === '+1') {
      value = {
        guest: true,
      };
    }

    seats[seatId] = value || null;

    this.props.handleChanges('event', {seats});
  },

  render() {
    let {season, event} = this.props;
    let attendees   = firebase.toArray(season.attendees),
        seasonSeats = firebase.toArray(season.seats);

    return (
      <List>
      {!event.sold && seasonSeats.map((seat, index) => {
        const items = attendees.concat(index ? [null, {
          $id: '+1',
          name: 'Guest',
        }] : []);
        let attendeeId = this.getSeatedAttendeeId(seat.$id);
        let attendee = this.getAttendee(attendeeId, items);
        if (typeof attendeeId === 'object') {
          attendee = attendeeId;
          attendeeId = '+1';
        }

        return (
          <div key={seat.$id}>
            <ListItemPicker
              leftIcon={<div><SeatAvatar data={attendee} setBackgroundColor={!!attendee} /></div>}
              hintText={`Section ${seat.section}, Row ${seat.row}, Seat ${seat.seat}`}
              items={items}
              value={attendeeId}
              onChange={(e,i,value)=>this.handleSeatChanges(e, seat.$id, value)}
            />
            {event.seats && attendeeId === '+1' &&
              <ListContainer insetChildren style={{paddingTop: 0, marginTop: -16}}>
                <TextField
                  floatingLabelText="Guest Name"
                  fullWidth
                  value={attendee.name || ''}
                  onChange={e=>this.handleSeatChanges(e, seat.$id, {...attendee, name: e.currentTarget.value})}
                />
                <TextField
                  floatingLabelText="Money Recouped"
                  fullWidth
                  type="number"
                  value={attendee.price || ''}
                  onChange={e=>this.handleSeatChanges(e, seat.$id, {...attendee, price: e.currentTarget.value})}
                />
              </ListContainer>
            }
          </div>
        );
      })}
        <Divider />
        <ListItem
          leftAvatar={<div><SeatAvatar sold data={event} setBackgroundColor={!!event.sold} /></div>}
          rightToggle={<Toggle toggled={!!event.sold} onToggle={e=>this.props.handleChanges('event', {sold: e.currentTarget.checked || null})} />}
          primaryText="Sold"
        />
      {event.sold &&
        <ListContainer insetChildren>
          <TextField
            floatingLabelText="Money Recouped"
            value={event.soldPrice || ''}
            onChange={e=>this.props.handleChanges('event', {soldPrice: e.currentTarget.value || null})}
            fullWidth
            type="number"
          />
        </ListContainer>
      }
      {event.sold &&
        <ListContainer insetChildren>
          <TextField
            floatingLabelText="Sold To"
            value={event.soldTo || ''}
            onChange={e=>this.props.handleChanges('event', {soldTo: e.currentTarget.value || null})}
            fullWidth
          />
        </ListContainer>
      }
      {event.sold &&
        <ListItemPicker
          leftIcon={<div><SeatAvatar data={this.getAttendee(event.soldPaidTo)} setBackgroundColor={!!this.getAttendee(event.soldPaidTo)} /></div>}
          floatingLabelText="Paid To"
          items={attendees}
          value={event.soldPaidTo || ''}
          onChange={(e,i,value)=>this.props.handleChanges('event', {soldPaidTo: value || null})}
        />
      }
        <Divider />
        <ListContainer>
          <TextField
            floatingLabelText="Notes"
            value={this.props.event.notes || ''}
            onChange={e=>this.props.handleChanges('event', {notes: e.currentTarget.value || null})}
            multiLine
            fullWidth
          />
        </ListContainer>
      </List>
    );
  },
});

export const EventInfo = React.createClass({
  getDefaultProps() {
    return {
      season: {},
      event:  {},
      handleChanges: () => {},
    };
  },

  handleEventDateTimeChange(type, date) {
    let $datetime = moment(date);
    if (type === 'date') {
      // prevent clearing the existing time
      $datetime = moment($datetime.format('YYYY-MM-DD') + ' ' + moment(this.props.event.datetime).format('h:mma'), 'YYYY-MM-DD h:mma');
    }
    this.props.handleChanges('event', {datetime: $datetime.format()});
  },

  render() {
    return (
      <List>
        <ListContainer>
          <TextField
            value={this.props.event.opponent || ''}
            onChange={e=>this.props.handleChanges('event', {opponent: e.currentTarget.value || null})}
            floatingLabelText="Opponent"
            fullWidth
          />
          <DatePicker
            value={moment(this.props.event.datetime).toDate()}
            onChange={(e, date)=>this.handleEventDateTimeChange('date', date)}
            formatDate={date=>moment(date).format('ddd, MMM D, YYYY')}
            floatingLabelText="Date"
            autoOk
            style={{display: 'inline-flex', width: '50%'}}
          />
          <TimePicker
            value={moment(this.props.event.datetime).toDate()}
            onChange={(e, date)=>this.handleEventDateTimeChange('time', date)}
            floatingLabelText="Time"
            autoOk
            pedantic
            style={{display: 'inline-flex', width: '50%'}}
          />
        </ListContainer>
      </List>
    );
  },
});
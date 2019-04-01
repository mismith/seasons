import React from 'react';
import ReactDOM from 'react-dom';
import {Link, browserHistory} from 'react-router';

import moment from 'moment';
import firebase from '../utils/firebase';
import formatEventName from '../utils/formatEventName';
import LocalStorageMixin from 'react-localstorage';

import {Tabs, Tab} from 'material-ui/Tabs';
import {List, ListItem} from 'material-ui/List';
import ListItemStat from './helpers/ListItemStat';
import {ListContainer} from './helpers/material-ui';
import Subheader from 'material-ui/Subheader';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import Toggle from 'material-ui/Toggle';
import TextField from 'material-ui/TextField';
import ChevronRightIcon from 'material-ui/svg-icons/navigation/chevron-right';

import Loader from './helpers/Loader';
import EventItem from './EventItem';
import SeatAvatar from './SeatAvatar';


export const Season = React.createClass({
  mixins: [
    LocalStorageMixin,
  ],

  getDefaultProps() {
    return {
      season: {},
      events: {},
    };
  },
  getInitialState() {
    let state = {
      activeTabIndex:  undefined,
      scrollPositions: {},
    };
    try {
      // manually override react-localstorage's auto-initializing because <Tabs initialSelectedIndex> needs to be set only once, so waiting until componentDidMount won't work
      return JSON.parse(localStorage.getItem('Season')) || {};
    } catch (err) {
      return state;
    }
  },

  groupEventsByMonth() {
    let eventsByMonth = [],
      previousMonthId;
    firebase.sortByKey(firebase.toArray(this.props.events[this.props.params.seasonId]), 'datetime').forEach(event => {
      event.$datetime = moment(event.datetime);

      let monthId = event.$datetime.format('YYYY-MM');
      if (monthId !== previousMonthId) {
        eventsByMonth.push([]);
        previousMonthId = monthId;
      }
      eventsByMonth[eventsByMonth.length - 1].push(event);
    });
    return eventsByMonth;
  },
  calculateStats() {
    // attendance
    let attendees = {};

    // sales
    let sales = {
      min:    Number.MAX_VALUE,
      max:    0,
      total:  0,
      count:  0,
      average: 0,
      minEvent: {},
      maxEvent: {},
    };

    // loop through all events
    firebase.toArray(this.props.events[this.props.params.seasonId]).forEach(event => {
      if (event.sold) {
        const price = parseFloat(event.soldPrice) || 0;

        if (price > sales.max) {
          sales.max      = price;
          sales.maxEvent = event;
        }
        if (price > 0 && price < sales.min) {
          sales.min      = price;
          sales.minEvent = event;
        }

        sales.total += price;
        sales.count++;
      } else if (event.seats) {
        let seatedAttendeeIds = []; // if a attendee takes multiple seats at one event, only count it as one attendance
        Object.keys(event.seats).forEach(seatId => {
          const attendeeId = event.seats[seatId];

          // add guest price to total recouped (but don't include it in any other calculations)
          if (typeof attendeeId === 'object') {
            sales.total += parseFloat(attendeeId.price) || 0;
          }

          if (seatedAttendeeIds.indexOf(attendeeId) >= 0) return;

          if (!attendees[attendeeId]) {
            if (this.props.season.attendees && this.props.season.attendees[attendeeId]) {
              attendees[attendeeId] = {...this.props.season.attendees[attendeeId]};
            } else {
              attendees[attendeeId] = {};
            }
            attendees[attendeeId].attendance = 0;
          }

          attendees[attendeeId].attendance++;

          seatedAttendeeIds.push(attendeeId);
        });
      }
    });

    // averages
    if (sales.count) {
      sales.average = sales.total / sales.count;
    } else {
      sales.min = 0;
    }

    return {
      attendees,
      sales,
    };
  },
  getAttendee(attendeeId) {
    return this.props.season.attendees[attendeeId]; // @TODO: add fallbacks
  },
  formatCurrency(num) {
    return typeof num === 'number' && num.toLocaleString('en-US', {style: 'currency', currency: 'CAD'});
  },

  handleTabChange(value, event, tab) {
    this.setState({
      activeTabIndex: tab.props.index,
    }, () => {
      this.restoreScrollPosition();
    });
  },
  rememberScrollPositions(ref) {
    if (!this.scrollContainer) {
      const el = ReactDOM.findDOMNode(ref);
      if (el) {
        this.scrollContainer = el.querySelector('.flex-scroll');
        if (this.scrollContainer) {
          this.scrollContainer.addEventListener('scroll', e => {
            this.setState({
              scrollPositions: {
                ...this.state.scrollPositions || {},
                [this.state.activeTabIndex]: e.target.scrollTop,
              },
            });
          });
        }
      }
    }
  },
  restoreScrollPosition() {
    if (this.scrollContainer && this.state.scrollPositions) {
      this.scrollContainer.scrollTop = this.state.scrollPositions[this.state.activeTabIndex] || 0;
    }
  },

  render() {
    let stats = this.calculateStats();

    this.restoreScrollPosition(); // @HACK? mightn't this cause an overflow somehow?

    return (
      <Tabs
        contentContainerClassName="flex-scroll"
        style={{display: 'flex', flexDirection: 'column'}}
        ref={ref=>this.rememberScrollPositions(ref)}
        onChange={this.handleTabChange}
        initialSelectedIndex={this.state.activeTabIndex}
      >
        <Tab label="Schedule">
          <List>
          {this.groupEventsByMonth().map((events, monthIndex) =>
            <div key={monthIndex}>
              <Subheader>{events[0].$datetime.format('MMMM')} {events[0].$datetime.format('M') === '1' && events[0].$datetime.format('YYYY')}</Subheader>
            {events.map(event => 
              <EventItem
                key={event.$id}
                event={event}
                season={this.props.season}
                containerElement={<Link to={'/season/' + this.props.params.seasonId + '/event/' + event.$id} />}
              />
            )}
            </div>
          )}
          {!this.groupEventsByMonth().length &&
            <div style={{textAlign: 'center', padding: '33% 0'}}>
              <em>No events yet.</em>
            </div>
          }
          </List>
        </Tab>
        <Tab label="Stats">
          <List>
            <Subheader>Events Attended</Subheader>
          {firebase.sortByKey(firebase.toArray(stats.attendees), 'attendance', true).map(attendee =>
            <ListItemStat
              key={attendee.$id}
              primaryText={attendee.name}
              leftAvatar={<div><SeatAvatar data={attendee} /></div>}
              stat={attendee.attendance}
              disabled
            />
          )}
          </List>
          <Divider />
          <List>
            <Subheader>Sales</Subheader>
            <ListItemStat primaryText="Number of sales" stat={stats.sales.count} disabled />
            <ListItemStat primaryText="Money recouped" stat={this.formatCurrency(stats.sales.total)} disabled />
            <ListItemStat primaryText="Average sale price" stat={this.formatCurrency(stats.sales.average)} disabled />
            <ListItemStat primaryText="Highest sale price" secondaryText={formatEventName(stats.sales.maxEvent)} stat={this.formatCurrency(stats.sales.max)} disabled />
            <ListItemStat primaryText="Lowest sale price" secondaryText={formatEventName(stats.sales.minEvent)} stat={this.formatCurrency(stats.sales.min)} disabled />
          </List>
        </Tab>
      </Tabs>
    )
  },
});

export const SeasonInfo = React.createClass({
  getDefaultProps() {
    return {
      season: {},
      events: {},
      handleChanges: () => {},
    };
  },

  getInitialState() {
    return {
      duplicateLoading: false,
      deleteLoading: false,
    };
  },

  handleDuplicate() {
    this.setState({
      duplicateLoading: true,
    });
    return this.props.handleChanges('season', this.season, true)
      .then(ref => browserHistory.push(`/season/${ref.key}/edit`))
      .then(() => fetch('/api/v1/scrapeEvents'))
      .then(res => res.json())
      .then(events => this.props.handleChanges('events', events))
      .then(() => {
        this.setState({
          duplicateLoading: false,
        });
        if (this.seasonNameInput) this.seasonNameInput.focus();
      });
  },
  handleDelete() {
    if (confirm('Are you sure?')) {
      this.setState({
        deleteLoading: true,
      });
      return this.props.handleChanges('season', null)
        .then(() => this.props.handleChanges('events', null))
        .then(() => {
          browserHistory.push(`/`);
          this.setState({
            deleteLoading: false,
          });
        });
    }
    return Promise.reject('User cancelled');
  },

  render() {
    return (
      <div>
        <ListContainer>
          <TextField
            ref={el => this.seasonNameInput = el}
            value={this.props.season.name || ''}
            onChange={e=>this.props.handleChanges('season', {name: e.currentTarget.value || null})}
            floatingLabelText="Season name"
            fullWidth
          />
          <TextField 
            value={this.props.season.cost || ''}
            onChange={e=>this.props.handleChanges('season', {cost: e.currentTarget.value || null})}
            floatingLabelText="Total cost"
            fullWidth
            type="number"
          />
        </ListContainer>
        <Divider />
        <List>
          <Subheader>Seats</Subheader>
        {firebase.toArray(this.props.season.seats).map(seat =>
          <ListItem
            key={seat.$id}
            leftAvatar={<div><SeatAvatar /></div>}
            rightIcon={<ChevronRightIcon />}
            containerElement={<Link to={'/season/' + this.props.params.seasonId + '/edit/seat/' + seat.$id} />}
            primaryText={`Section ${seat.section}, Row ${seat.row}, Seat ${seat.seat}`}
          />
        )}
        </List>
        <ListContainer style={{textAlign: 'right'}}>
          <FlatButton
            primary
            containerElement={<Link to={'/season/' + this.props.params.seasonId + '/edit/seat/' + firebase.key()} />}
            label="Add new seat"
          />
        </ListContainer>
        <Divider />
        <List>
          <Subheader>Attendees</Subheader>
        {firebase.toArray(this.props.season.attendees).map(attendee =>
          <ListItem
            key={attendee.$id}
            leftAvatar={<div><SeatAvatar data={attendee} setBackgroundColor={!!attendee.isActive} /></div>}
            rightIcon={<ChevronRightIcon />}
            containerElement={<Link to={'/season/' + this.props.params.seasonId + '/edit/attendee/' + attendee.$id} />}
            primaryText={attendee.name}
          />
        )}
        </List>
        <ListContainer style={{textAlign: 'right'}}>
          <FlatButton
            primary
            containerElement={<Link to={'/season/' + this.props.params.seasonId + '/edit/attendee/' + firebase.key()} />}
            label="Add new attendee"
          />
        </ListContainer>
        <Divider />
        <List>
          <Subheader>Events</Subheader>
          <ListItem
            primaryText="Total events"
            rightIcon={<div>{firebase.toArray(this.props.events[this.props.params.seasonId]).length}</div>}
          />
        </List>
        <ListContainer style={{textAlign: 'right'}}>
          <FlatButton
            primary
            containerElement={<Link to={'/season/' + this.props.params.seasonId + '/event/' + firebase.key() + '/edit'} />}
            label="Add new event"
          />
        </ListContainer>
        <Divider />
        <Subheader>Meta</Subheader>
        <ListContainer style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        {!this.state.deleteLoading ?
          <FlatButton
            labelStyle={{color: 'red'}}
            onClick={this.handleDelete}
            label="Delete season"
          />
        :
          <Loader />
        }
        {!this.state.duplicateLoading ?
          <FlatButton
            secondary
            onClick={this.handleDuplicate}
            label="Duplicate season"
          />
        :
          <Loader />
        }
        </ListContainer>
      </div>
    )
  },
});

export const SeasonSeat = React.createClass({
  getDefaultProps() {
    return {
      seat: {},
      handleChanges: () => {},
    };
  },

  render() {
    return (
      <div>
        <ListContainer>
          <TextField
            value={this.props.seat.section || ''}
            onChange={e=>this.props.handleChanges('seat', {section: e.currentTarget.value || null})}
            floatingLabelText="Section"
            fullWidth
          />
          <TextField
            value={this.props.seat.row || ''}
            onChange={e=>this.props.handleChanges('seat', {row: e.currentTarget.value || null})}
            floatingLabelText="Row"
            fullWidth
          />
          <TextField
            value={this.props.seat.seat || ''}
            onChange={e=>this.props.handleChanges('seat', {seat: e.currentTarget.value || null})}
            floatingLabelText="Seat"
            fullWidth
          />
        </ListContainer>
      </div>
    )
  },
});

export const SeasonAttendee = React.createClass({
  getDefaultProps() {
    return {
      attendee: {},
      handleChanges: () => {},
    };
  },

  render() {
    return (
      <List>
        <ListContainer>
          <TextField
            value={this.props.attendee.name || ''}
            onChange={e=>this.props.handleChanges('attendee', {name: e.currentTarget.value || null})}
            floatingLabelText="Name"
            fullWidth
          />
        </ListContainer>
        <ListItem
          rightToggle={<Toggle toggled={!!this.props.attendee.isActive} onToggle={e=>this.props.handleChanges('attendee', {isActive: e.currentTarget.checked || null})} />}
          primaryText="Active"
        />
      </List>
    )
  },
});
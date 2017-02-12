import React from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router';

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
    let users = {};

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
        let seatedUserIds = []; // if a user takes multiple seats at one event, only count it as one attendance
        Object.entries(event.seats).forEach(([seatId, seat]) => {
          const userId = event.seats[seatId];

          if (seatedUserIds.indexOf(userId) >= 0) return;

          if (!users[userId]) {
            if (this.props.season.users && this.props.season.users[userId]) {
              users[userId] = {...this.props.season.users[userId]};
            } else {
              users[userId] = {};
            }
            users[userId].attendance = 0;
          }

          users[userId].attendance++;

          seatedUserIds.push(userId);
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
      users,
      sales,
    };
  },
  getUser(userId) {
    return this.props.season.users[userId]; // @TODO: add fallbacks
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
          </List>
        </Tab>
        <Tab label="Stats">
          <List>
            <Subheader>Events Attended</Subheader>
          {firebase.sortByKey(firebase.toArray(stats.users), 'attendance', true).map(user =>
            <ListItemStat
              key={user.$id}
              primaryText={user.name}
              leftAvatar={<div><SeatAvatar data={user} /></div>}
              stat={user.attendance}
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

  render() {
    return (
      <div>
        <ListContainer>
          <TextField
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
        {firebase.toArray(this.props.season.users).map(user =>
          <ListItem
            key={user.$id}
            leftAvatar={<div><SeatAvatar data={user} setBackgroundColor={!!user.isActive} /></div>}
            rightIcon={<ChevronRightIcon />}
            containerElement={<Link to={'/season/' + this.props.params.seasonId + '/edit/user/' + user.$id} />}
            primaryText={user.name}
          />
        )}
        </List>
        <ListContainer style={{textAlign: 'right'}}>
          <FlatButton
            primary
            containerElement={<Link to={'/season/' + this.props.params.seasonId + '/edit/user/' + firebase.key()} />}
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

export const SeasonUser = React.createClass({
  getDefaultProps() {
    return {
      user: {},
      handleChanges: () => {},
    };
  },

  render() {
    return (
      <List>
        <ListContainer>
          <TextField
            value={this.props.user.name || ''}
            onChange={e=>this.props.handleChanges('user', {name: e.currentTarget.value || null})}
            floatingLabelText="Name"
            fullWidth
          />
        </ListContainer>
        <ListItem
          rightToggle={<Toggle toggled={!!this.props.user.isActive} onToggle={e=>this.props.handleChanges('user', {isActive: e.currentTarget.checked || null})} />}
          primaryText="Active"
        />
      </List>
    )
  },
});
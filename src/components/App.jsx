import React from 'react';
import {Link, browserHistory} from 'react-router';

import Helmet from 'react-helmet';
import LogoImg from '../images/logo.png';
import TouchiconImg from '../images/touchicon.png';

import moment from 'moment';
import firebase from '../utils/firebase';
import ReactFireMixin from 'reactfire';
import formatEventName from '../utils/formatEventName';

import SwipeBack from './helpers/SwipeBack';

import Drawer from 'material-ui/Drawer';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import PowerSettingsIcon from 'material-ui/svg-icons/action/power-settings-new';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import InfoIcon from 'material-ui/svg-icons/action/info-outline';
import DeleteIcon from 'material-ui/svg-icons/action/delete';

import EventItem from './EventItem';
import Loader from './helpers/Loader';
import './App.css';


export default React.createClass({
  mixins: [ReactFireMixin],
  getDefaultProps() {
    return {
      params: {
        seasonId: undefined,
        eventId:  undefined,
        seatId:   undefined,
        userId:   undefined,
      },
    };
  },
  getInitialState() {
    return {
      drawerOpen: false,

      me: null,

      season:  {},
      event:   {},
      seat:    {},
      events:  {},
      seasons: {},

      seasonLoaded:  false,
      eventLoaded:   false,
      seatLoaded:    false,
      seasonsLoaded: false,
      eventsLoaded:  false,

      authLoaded: false,

      relevantEvents: [],
    };
  },

  unbindPageData() {
    firebase.unsync(this, 'season', 'event', 'seat', 'user');
  },
  bindPageData(props = this.props) {
    this.unbindPageData();

    if (props.params.seasonId) {
      firebase.sync(this, 'season', 'seasons/' + props.params.seasonId)

      if (props.params.eventId) {
        firebase.sync(this, 'event', 'seasons:events/' + props.params.seasonId + '/' + props.params.eventId);
      }
      if (props.params.seatId ) {
        firebase.sync(this, 'seat', 'seasons/' + props.params.seasonId + '/seats/' + props.params.seatId);
      }
      if (props.params.userId ) {
        firebase.sync(this, 'user', 'seasons/' + props.params.seasonId + '/users/' + props.params.userId);
      }
    }
  },
  unbindGlobalData() {
    firebase.unsync(this, 'seasons', 'events');
  },
  bindGlobalData() {
    this.unbindGlobalData();

    firebase.sync(this, 'seasons', 'seasons');
    firebase.sync(this, 'events', 'seasons:events');
  },
  componentWillMount() {
    firebase.auth().onAuthStateChanged(me => {
      if (me) {
        this.bindGlobalData();
        this.bindPageData();

        firebase.database().ref('users/' + me.uid).update({
          email: me.email,
          displayName: me.displayName,
          photoURL: me.photoURL,
        });
        firebase.database().ref('users:sessions/' + me.uid).push({
          userAgent: (navigator.standalone ? 'standalone ' : '') + navigator.userAgent,
          timestamp: moment().format(),
        });
      } else {
        this.unbindGlobalData();
        this.unbindPageData();
      }

      this.setState({
        me, // @TODO: why is this not setting to null on signOut?
        authLoaded: true,
      });
    });
  },
  componentWillReceiveProps(nextProps) {
    this.bindPageData(nextProps);
  },
  componentWillUnmount() {
    this.unbindGlobalData();
    this.unbindPageData();
  },

  isLoaded() {
    if (this.props.params.eventId) {
      return this.state.eventLoaded;
    } else if (this.props.params.seasonId) {
      return this.state.seasonLoaded;
    } else {
      return true;
    }
  },
  getTitle() {
    if (this.props.params.eventId && this.state.eventLoaded) {
      return formatEventName(this.state.event);
    } else if (this.props.params.seasonId && this.state.seasonLoaded) {
      return this.state.season.name || 'Season name';
    }
    return '';
  },
  getParentUrl() {
    let path = '';
    if (this.props.routes) {
      const routes = this.props.routes.filter(route => route.path && route.path.length > 1); // trim root and any RouteIndex/empty-path-routes
      if (routes.length > 1) { // can only have a parent if it's not the only route
        for (let i = 0; i < routes.length - 1; i++) { // all but the last one
          path += '/' + routes[i].path;
        }
        path = path.replace(/:\w+/ig, key => this.props.params[key.substring(1)]); // replace params with current values
      }
    }
    return path;
  },
  getRightMenuButton() {
    if (this.state.me) {
      if (this.props.routes || this.props.routes.length) {
        let name = this.props.routes[this.props.routes.length - 1].name;
        switch (name) {
          case 'season':
            return (
              <IconButton containerElement={<Link to={'/season/' + this.props.params.seasonId + '/edit'} />}>
                <InfoIcon />
              </IconButton>
            );
          case 'event':
            return (
              <IconButton containerElement={<Link to={'/season/' + this.props.params.seasonId + '/event/' + this.props.params.eventId + '/edit'} />}>
                <InfoIcon />
              </IconButton>
            );
          //case 'season.edit':
          case 'season.seat':
          case 'season.user':
          //case 'event.edit':
            let modelName = name.split('.')[1];
            const check = e => {
              if (e.shiftKey || confirm('Are you sure?')) {
                this.handleChanges(modelName, null);
                browserHistory.replace(this.getParentUrl());
              }
            }
            return (
              <IconButton onClick={check}>
                <DeleteIcon />
              </IconButton>
            );
          default:
            return;
        }
      }
    }
    return;
  },
  getRelevantEvents() {
    let relevantEvents = [],
      upcomingEvents = [],
      seasons = this.state.seasons;

    if (seasons) {
      firebase.toArray(this.state.events).forEach(events => {
        firebase.toArray(events)
          .filter(event => {
            // store for later
            event.$season = seasons[events.$id];
            event.$season.$id = events.$id;

            let dayDiff = -1 * moment().diff(event.datetime, 'days');
            if (dayDiff < 0) {
              // event has passed
              if(!event.seats && !event.sold) {
                // we don't know if sold or attended yet
                return true;
              } else if (dayDiff > -3) {
                // event was in the past 3 days
                return true;
              }
            } else {
              // event is upcoming
              upcomingEvents.push(event);

              // event is upcoming soon
              if (dayDiff < 3) {
                // event is in the next 3 days
                return true;
              }
            }
            return false;
          }).forEach(event => {
            relevantEvents.push(event);
          });
      });

      // pad with upcoming events, if under 3 events
      while (relevantEvents.length < 3 && upcomingEvents.length) {
        relevantEvents.push(upcomingEvents.shift());
      }

      firebase.sortByKey(relevantEvents, 'datetime');
      //firebase.sortByDatetime(upcomingEvents);
    }

    return relevantEvents;
  },

  handleDrawerToggle() {
    this.setState({drawerOpen: !this.state.drawerOpen});
  },
  handleDrawerClose() {
    this.setState({drawerOpen: false});
  },
  handleChanges(name, changes) {
    let ref = undefined;
    switch(name) {
      case 'season':
        ref = firebase.database().ref('seasons/' + this.props.params.seasonId);
        break;
      case 'event':
        ref = firebase.database().ref('seasons:events/' + this.props.params.seasonId + '/' + this.props.params.eventId);
        break;
      case 'seat':
        ref = firebase.database().ref('seasons/' + this.props.params.seasonId + '/seats/' + this.props.params.seatId);
        break;
      case 'user':
        ref = firebase.database().ref('seasons/' + this.props.params.seasonId + '/users/' + this.props.params.userId);
        break;
      default:
        // ignore
        break;
    }
    if (ref) {
      if (changes === null) {
        ref.remove();
      } else {
        ref.update(changes);
      }
    }
  },

  render() {
    let relevantEvents = this.getRelevantEvents();

    return (
      <SwipeBack id="viewport">
        <Helmet link={[
            {rel: 'shortcut icon', href: LogoImg},
            {rel: 'apple-touch-icon', href: TouchiconImg},
          ]}
        />
      {this.state.me && 
        <Drawer
          docked={false}
          disableSwipeToOpen
          open={this.state.drawerOpen}
          onRequestChange={this.handleDrawerClose}
          containerStyle={{display: 'flex', flexDirection: 'column'}}
        >
          <List onTouchTap={this.handleDrawerClose}>
            <Subheader>Seasons</Subheader>
          {this.state.seasonsLoaded ? firebase.toArray(this.state.seasons).map(season => 
            <ListItem
              key={season.$id}
              primaryText={season.name}
              containerElement={<Link to={'/season/' + season.$id} />}
            />
          ) : <Loader />}
            {/*<ListItem
              primaryText="Add new season"
              rightIcon={<AddIcon />}
              containerElement={<Link to="/season/new" />}
            />*/}
            <Divider />
          </List>

        {relevantEvents.length > 0 && 
          <List onTouchTap={this.handleDrawerClose}>
            <Subheader>Events</Subheader>
          {this.state.eventsLoaded ? relevantEvents.map((event, eventIndex) => 
            <EventItem
              key={eventIndex}
              event={event}
              season={event.$season}
              showDayAvatar={false}
              containerElement={<Link to={'/season/' + event.$season.$id + '/event/' + event.$id} />}
            />
          ) : <Loader />}
            <Divider />
          </List>
        }

          <List onTouchTap={this.handleDrawerClose} style={{marginTop: 'auto'}}>
            <Subheader>Account</Subheader>
            <ListItem
              primaryText="Logout"
              rightIcon={<PowerSettingsIcon />}
              onTouchTap={firebase.logout}
            />
          </List>
        </Drawer>
      }
      {this.state.me &&
        <AppBar
          title={this.getTitle()}
          showMenuIconButton={!!this.state.me}
          onTitleTouchTap={e=>browserHistory.push(this.getParentUrl())}
          onLeftIconButtonTouchTap={this.handleDrawerToggle}
          iconElementRight={this.getRightMenuButton()}
          style={{flexShrink: 0}}
        />
      }
        <main id="main" className="flex-scroll">{
          this.isLoaded() ?
            React.cloneElement(this.props.children, {...this.state, handleChanges: this.handleChanges})
          :
            <Loader style={{padding: 40}} />
        }</main>
      </SwipeBack>
    );
  },
});
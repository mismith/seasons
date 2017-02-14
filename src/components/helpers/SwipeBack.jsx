import React, {Component} from 'react';
import {browserHistory} from 'react-router';

import SwipeableViews from 'react-swipeable-views';

export default class SwipeBack extends Component {
  state = {
    index: 1,
  }

  constructor() {
    super();

    this.onChangeIndex = this.onChangeIndex.bind(this);
  }

  onChangeIndex(index, latestIndex) {
    if (index < latestIndex) {
      this.setState({
        index: 0,
      }, () => {
        this.setState({
          index: 1,
        });
      });
      browserHistory.goBack();
    }
  }

  render() {
    const {children, ...props} = this.props;
    return (
      <SwipeableViews
        index={this.state.index}
        onChangeIndex={this.onChangeIndex}
        hysteresis={0.1}
        containerStyle={{flexGrow: 1}}
        slideStyle={{display: 'flex', flexDirection: 'column', overflow: 'hidden'}}
        {...props}
      >
        <div />
        <div style={{display: 'flex', flexDirection: 'column', minHeight: '100%'}}>{children}</div>
      </SwipeableViews>
    );
  }
}
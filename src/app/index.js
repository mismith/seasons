import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';
import Home from './components/Home';

// for bundling you styles
import './styles/bundle.scss';


ReactDOM.render(<App><Home /></App>, document.querySelector('#app'));

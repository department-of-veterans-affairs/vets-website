import React from 'react';
import ReactDOM from 'react-dom';

import { Router, browserHistory } from 'react-router';
import routes from './routes';

require('../../sass/facility-locator.scss');

function init() {
  ReactDOM.render((
    <Router history={browserHistory} routes={routes}/>
    ), document.getElementById('react-root'));
}

// Start react.
initReact(init);

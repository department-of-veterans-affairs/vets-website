import initReact from '../common/init-react';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import routes from './routes';

require('../../sass/gi-bill-comparison-tool/gi-bill-comparison-tool.scss');

function init() {
  ReactDOM.render(
    <Router history={browserHistory} routes={routes}/>,
    document.getElementById('react-root')
  );
}

initReact(init);

import React from 'react';
import { Route, IndexRoute } from 'react-router';

import DownloadLetters from './containers/DownloadLetters.jsx';
import Main from './containers/Main.jsx';

const routes = [
  <Route
    component={Main}
    key="main">
    <IndexRoute
      component={DownloadLetters}
      name="Download Letters"
      key="download-letters"/>
  </Route>
];

export default routes;

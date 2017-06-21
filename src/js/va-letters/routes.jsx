import React from 'react';
import { Route } from 'react-router';

import DownloadLetters from './containers/DownloadLetters.jsx';

const routes = [
  <Route
      component={DownloadLetters}
      name="Download Letters"
      key="/download-letters"
      path="/download-letters"/>
];

export default routes;

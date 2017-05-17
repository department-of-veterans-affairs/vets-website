import React from 'react';
import { Route } from 'react-router';

import ConfirmAddress from './containers/ConfirmAddress.jsx';
import DownloadLetters from './containers/DownloadLetters.jsx';

const routes = [
  <Route
      component={ConfirmAddress}
      key="/confirm-address"
      path="/confirm-address"/>,
  <Route
      component={DownloadLetters}
      key="/download-letters"
      path="/download-letters"/>
];

export default routes;

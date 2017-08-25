import React from 'react';
import { Route } from 'react-router';

import DownloadLetters from './containers/DownloadLetters.jsx';
import AddressSection from './containers/AddressSection.jsx';
import LetterList from './containers/LetterList.jsx';
import Main from './containers/Main.jsx';

const routes = [
  <Route
    component={Main}
    key="main">
    <Route
      component={DownloadLetters}
      name="Download Letters"
      key="download-letters">
      <Route
        component={AddressSection}
        name="Review your address"
        key="confirm-address"
        path="confirm-address"/>,
      <Route
        component={LetterList}
        name="Select and download"
        key="letter-list"
        path="letter-list"/>
    </Route>
  </Route>
];

export default routes;

export const chapters = [
  { name: 'Review your address', path: '/confirm-address' },
  { name: 'Select and download', path: '/letter-list' }
];

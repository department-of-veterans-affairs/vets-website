import React from 'react';
import { Route, IndexRedirect } from 'react-router';

import App from './containers/App';
import AddressSection from './containers/AddressSection';
import DownloadLetters from './containers/DownloadLetters';
import LetterList from './containers/LetterList';
import Main from './containers/Main';

const routes = (
  <Route path="/" component={App}>
    <Route
      component={DownloadLetters}
      name="Download Letters"
      key="download-letters"
    >
      <IndexRedirect to="confirm-address" />,
      <Route
        component={AddressSection}
        name="Review your address"
        key="confirm-address"
        path="confirm-address"
      />
      ,
      <Route component={Main} key="main">
        <Route
          component={LetterList}
          name="Select and download"
          key="letter-list"
          path="letter-list"
        />
      </Route>
    </Route>
  </Route>
);

export default routes;

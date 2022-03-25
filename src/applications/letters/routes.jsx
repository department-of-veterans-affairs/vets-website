import React from 'react';
import { Route, IndexRedirect } from 'react-router';

import DownloadLetters from './containers/DownloadLetters';
import AddressSection from './containers/AddressSection';
import LetterList from './containers/LetterList';
import Main from './containers/Main';
import LettersApp from './containers/LettersApp';

const routes = (
  <Route path="/" component={LettersApp}>
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

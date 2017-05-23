import React from 'react';
import { Route } from 'react-router';

import { groupPagesIntoChapters, getPageList } from '../common/utils/helpers';

import ConfirmAddress from './containers/ConfirmAddress.jsx';
import DownloadLetters from './containers/DownloadLetters.jsx';
import { chapterNames } from './utils/helpers';

const routes = [
  <Route
      component={ConfirmAddress}
      chapter={chapterNames.confirmAddress}
      name="Confirm Address"
      key="/confirm-address"
      path="/confirm-address"/>,
  <Route
      component={DownloadLetters}
      chapter={chapterNames.downloadLetters}
      name="Download Letters"
      key="/download-letters"
      path="/download-letters"/>
];

export default routes;

// Chapters are groups of form pages that correspond to the steps in the navigation components
export const chapters = groupPagesIntoChapters(routes.map(r => r.props));
export const pages = getPageList(routes.map(r => r.props));

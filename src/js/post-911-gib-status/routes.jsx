import React from 'react';
import { Route } from 'react-router';

// import Post911GIBStatusApp from './containers/Post911GIBStatusApp';
import PrintPage from './containers/PrintPage';

// const routes = {
//   path: '/',
//   component: Post911GIBStatusApp
// };

const routes = [
  <Route
      component={PrintPage}
      key="/print"
      path="/print"/>
];

export default routes;

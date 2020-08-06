import React from 'react';

import SignInApp from './containers/SignInApp';
import SignInWrapper from './components/SignInWrapper';
import VerifyPage from './components/VerifyPage';

const routes = {
  path: '/',
  component: SignInWrapper,
  indexRoute: { component: SignInApp },
  childRoutes: [{ path: 'verify', component: VerifyPage }],
};

export default routes;

import React from 'react';
import environment from 'platform/utilities/environment';
import SignInApp from './containers/SignInApp';
import SignInWrapper from './components/SignInWrapper';
import MockAuth from './containers/MockAuth';

import AuthDemo from './auth-demo';
import { AuthProvider } from './auth-demo/context/AuthContext';

const routes = {
  path: '/',
  component: SignInWrapper,
  indexRoute: { component: SignInApp },
  childRoutes:
    environment.isDev() || environment.isLocalhost()
      ? [
          {
            path: 'mocked-auth',
            component: MockAuth,
          },
          {
            path: 'auth-demo',
            component: props => (
              <AuthProvider>
                <AuthDemo {...props} />
              </AuthProvider>
            ), // Wrap SinglePageAuthApp with AuthProvider
          },
        ]
      : [],
};

export default routes;

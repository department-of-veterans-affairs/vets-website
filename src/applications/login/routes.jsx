import environment from 'platform/utilities/environment';
import SignInApp from './containers/SignInApp';
import SignInWrapper from './components/SignInWrapper';
import MockAuth from './containers/MockAuth';
import MhvSignIn from './containers/MhvSignIn';
import MhvAccess from './containers/MhvAccess';

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
        ]
      : [
          {
            path: 'access-myhealthevet-test-account',
            component: MhvSignIn,
          },
          {
            path: 'mhv',
            component: MhvAccess,
          },
        ],
};

export default routes;

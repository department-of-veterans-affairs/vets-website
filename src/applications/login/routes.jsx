import environment from 'platform/utilities/environment';
import SignInApp from './containers/SignInApp';
import SignInWrapper from './components/SignInWrapper';
import MockAuth from './containers/MockAuth';
import MhvProdTestAccess from './containers/MhvProdTestAccess';
import MhvTemporaryAccess from './containers/MhvTemporaryAccess';

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
            path: 'access-myhealthevet-test-account',
            component: MhvProdTestAccess,
          },
          {
            path: 'mhv',
            component: MhvTemporaryAccess,
          },
        ]
      : [
          {
            path: 'access-myhealthevet-test-account',
            component: MhvProdTestAccess,
          },
          {
            path: 'mhv',
            component: MhvTemporaryAccess,
          },
        ],
};

export default routes;

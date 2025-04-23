import environment from 'platform/utilities/environment';
import SignInApp from './containers/SignInApp';
import SignInWrapper from './components/SignInWrapper';
import MockAuth from './containers/MockAuth';
import ProdTestAccess from './containers/ProdTestAccess';
import MhvTemporaryAccess from './containers/MhvTemporaryAccess';
import DSLogonPage from './containers/DSLogonPage';

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
            path: 'access-production-test-account',
            component: ProdTestAccess,
          },
          {
            path: 'mhv',
            component: MhvTemporaryAccess,
          },
          {
            path: 'deprecation-reminder',
            component: DSLogonPage,
          },
        ]
      : [
          {
            path: 'access-production-test-account',
            component: ProdTestAccess,
          },
          {
            path: 'mhv',
            component: MhvTemporaryAccess,
          },
        ],
};

export default routes;

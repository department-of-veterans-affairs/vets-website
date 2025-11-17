import environment from 'platform/utilities/environment';
import SignInApp from './containers/SignInApp';
import SignInWrapper from './components/SignInWrapper';
import MockAuth from './containers/MockAuth';
import ProdTestAccess from './containers/ProdTestAccess';
import MhvTemporaryAccess from './containers/MhvTemporaryAccess';
import VHAPortalRemovalNotice from './components/VHAPortalRemovalNotice';

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
          // TODO: Temporary route 'vha-portal-removal-notice' - remove after new app initialization
          {
            path: 'vha-portal-removal-notice',
            component: VHAPortalRemovalNotice,
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
          {
            path: 'vha-portal-removal-notice',
            component: VHAPortalRemovalNotice,
          },
        ],
};

export default routes;

import environment from 'platform/utilities/environment';
import SignInApp from './containers/SignInApp';
import SignInWrapper from './components/SignInWrapper';
import MockAuth from './containers/MockAuth';
import ProdTestAccess from './containers/ProdTestAccess';
import MhvTemporaryAccess from './containers/MhvTemporaryAccess';
import MhvDemoLandingPageContainer from './containers/MhvDemoLandingPageContainer';
import MhvDemoMedicalRecordsLandingPage from './containers/MhvDemoMedicalRecordsLandingPage';

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
            path: 'mhv-demo-mode-landing-page',
            component: MhvDemoLandingPageContainer,
          },
          {
            path: 'mhv-demo-mode-medical-records',
            component: MhvDemoMedicalRecordsLandingPage,
          },
          {
            path: 'mhv-demo-mode-payments',
            // component: Mocked payments landing page,
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

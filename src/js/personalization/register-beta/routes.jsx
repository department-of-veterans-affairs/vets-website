import BetaEnrollment from './containers/BetaEnrollment';
import Main from './containers/Main';

const routes = {
  path: '/personalization-register-beta',
  component: BetaEnrollment,
  indexRoute: { component: Main },
};

export default routes;


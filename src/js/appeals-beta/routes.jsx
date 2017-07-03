import AppealsBetaEnrollment from './containers/AppealsBetaEnrollment';
import Main from './containers/Main';

const routes = {
  path: '/appeals-beta',
  component: AppealsBetaEnrollment,
  indexRoute: { component: Main },
};

export default routes;

import IDCardBetaEnrollment from './containers/IDCardBetaEnrollment';
import Main from './containers/Main';
import IDCardBetaManifest from './manifest.json';

const routes = {
  path: IDCardBetaManifest.rootUrl,
  component: IDCardBetaEnrollment,
  indexRoute: { component: Main },
};

export default routes;

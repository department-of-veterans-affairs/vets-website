import AuthApp from './containers/AuthApp';
import AuthManifest from './manifest.json';

const routes = {
  path: AuthManifest.rootUrl,
  component: AuthApp
};

export default routes;

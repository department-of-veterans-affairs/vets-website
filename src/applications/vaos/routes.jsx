import VAOSApp from './containers/VAOSApp';
import Index from './containers/Main';

const routes = {
  component: VAOSApp,
  childRoutes: [{ path: '/', component: Index }],
};

export default routes;

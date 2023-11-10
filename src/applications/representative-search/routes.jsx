import SearchPage from './containers/SearchPage';
import App from './containers/App';

const routes = {
  path: '/',
  component: App,
  childRoutes: [{ indexRoute: { component: SearchPage } }],
};

export default routes;

import App from './containers/App';
import HomePage from './containers/HomePage';
import { ROUTES } from './constants';

const routes = {
  path: '/',
  component: App,
  indexRoute: {
    onEnter: (nextState, replace) => replace(`/${ROUTES.HOME}`),
    component: HomePage,
  },
  childRoutes: [
    { path: ROUTES.HOME, component: HomePage },
    { path: ROUTES.Q_1_1_CLAIM_DECISION, component: HomePage }, // Placeholder
  ],
};

export default routes;

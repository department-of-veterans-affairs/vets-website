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
    { path: ROUTES.CLAIM_DECISION_1_1, component: HomePage }, // Placeholder
  ],
};

export default routes;

import BurnPit210 from './containers/questions/burn-pit/BurnPit-2-1-0';
import HomePage from './containers/HomePage';
import PACTActApp from './components/PACTActApp';
import Results1Page1 from './containers/results/1/Page1';
import Results1Page2 from './containers/results/1/Page2';
import ServicePeriod from './containers/questions/ServicePeriod';
import { ROUTES } from './constants';

const routes = {
  path: '/',
  component: PACTActApp,
  indexRoute: {
    onEnter: (nextState, replace) => replace(`/${ROUTES.HOME}`),
    component: HomePage,
  },
  childRoutes: [
    { path: ROUTES.BURN_PIT_210, component: BurnPit210 },
    { path: ROUTES.HOME, component: HomePage },
    { path: ROUTES.RESULTS_SET_1_PAGE_1, component: Results1Page1 },
    { path: ROUTES.RESULTS_SET_1_PAGE_2, component: Results1Page2 },
    { path: ROUTES.SERVICE_PERIOD, component: ServicePeriod },
  ],
};

export default routes;

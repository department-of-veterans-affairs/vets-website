import PACTActApp from './components/PACTActApp';
import Results1Page1 from './containers/results/1/Page1';
import Results1Page2 from './containers/results/1/Page2';
import { ROUTES } from './constants';

const routes = {
  path: '/',
  component: PACTActApp,
  indexRoute: {
    onEnter: (nextState, replace) => replace(`/${ROUTES.RESULTS_SET_1_PAGE_1}`),
    component: Results1Page1,
  },
  childRoutes: [
    { path: ROUTES.RESULTS_SET_1_PAGE_1, component: Results1Page1 },
    { path: ROUTES.RESULTS_SET_1_PAGE_2, component: Results1Page2 },
  ],
};

export default routes;

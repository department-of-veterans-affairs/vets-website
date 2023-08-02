import DependentsPage from './containers/DependentsPage';
import HomePage from './containers/HomePage';
import IncomeLimitsApp from './components/IncomeLimitsApp';
import ResultsPage from './containers/ResultsPage';
import ReviewPage from './containers/ReviewPage';
import YearPage from './containers/YearPage';
import ZipCodePage from './containers/ZipCodePage';
import { ROUTES } from './constants';

const routes = {
  path: '/',
  component: IncomeLimitsApp,
  indexRoute: {
    onEnter: (nextState, replace) => replace('/introduction'),
    component: HomePage,
  },
  childRoutes: [
    { path: ROUTES.HOME, component: HomePage },
    { path: ROUTES.DEPENDENTS, component: DependentsPage },
    { path: ROUTES.REVIEW, component: ReviewPage },
    { path: ROUTES.RESULTS, component: ResultsPage },
    { path: ROUTES.YEAR, component: YearPage },
    { path: ROUTES.ZIPCODE, component: ZipCodePage },
  ],
};

export default routes;

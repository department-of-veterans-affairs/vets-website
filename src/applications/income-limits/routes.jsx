import DependentsPage from './containers/DependentsPage';
import IncomeLimitsApp from './components/IncomeLimitsApp';
import ResultsPage from './containers/ResultsPage';
import ReviewPage from './containers/ReviewPage';
import ZipCodePage from './containers/ZipCodePage';
import { ROUTES } from './constants';

const routes = {
  path: '/',
  component: IncomeLimitsApp,
  indexRoute: { component: ZipCodePage },
  childRoutes: [
    { path: ROUTES.DEPENDENTS, component: DependentsPage },
    { path: ROUTES.REVIEW, component: ReviewPage },
    { path: ROUTES.RESULTS, component: ResultsPage },
    { path: ROUTES.ZIPCODE, component: ZipCodePage },
  ],
};

export default routes;

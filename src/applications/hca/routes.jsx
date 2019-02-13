import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import environment from 'platform/utilities/environment';

import formConfig from './config/form';
import HealthCareApp from './HealthCareApp.jsx';
import IDPage from './containers/IDPage';

const formRoutes = createRoutesWithSaveInProgress(formConfig);

// If the route's path ends in `introduction` then the form system will treat it
// as an Introduction page (ie it won't add the Title component or navigation
// elements) which is what we want in this case.
const idFormRoute = {
  path: 'id-introduction',
  component: IDPage,
  key: 'id-introduction',
};

const routes = {
  path: '/',
  component: HealthCareApp,
  indexRoute: {
    onEnter: (nextState, replace) => replace('/introduction'),
  },
  // do not allow the idFormRoute in production
  childRoutes: environment.isProduction()
    ? formRoutes
    : [idFormRoute, ...formRoutes],
};

export default routes;

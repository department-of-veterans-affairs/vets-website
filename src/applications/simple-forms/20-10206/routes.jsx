import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import { routeHoc } from 'applications/_mock-form-ae-design-patterns/routes';

import { lazy } from 'react';
import formConfig from './config/form';

const App = lazy(() => import('./containers/App'));

const route = {
  path: '/',
  component: routeHoc(App),
  indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },

  childRoutes: createRoutesWithSaveInProgress(formConfig),
};

export default route;

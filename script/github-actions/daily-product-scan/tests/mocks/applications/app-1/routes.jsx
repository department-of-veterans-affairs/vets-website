/* eslint-disable import/extensions */
import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';

import formConfig from './config/form';
import HealthCareApp from './HealthCareApp.jsx';

const routes = {
  path: '/',
  component: HealthCareApp,
  indexRoute: {
    onEnter: (nextState, replace) => replace('/introduction'),
  },
  childRoutes: createRoutesWithSaveInProgress(formConfig),
};

export default routes;

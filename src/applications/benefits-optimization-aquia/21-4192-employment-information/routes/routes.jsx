import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from '@bio-aquia/21-4192-employment-information/config/form';
import App from '@bio-aquia/21-4192-employment-information/containers/app';

/**
 * Route configuration for the 21-4192 form application
 * @module routes
 */
const route = {
  path: '/',
  component: App,
  indexRoute: { onEnter: (_nextState, replace) => replace('/introduction') },
  childRoutes: createRoutesWithSaveInProgress(formConfig),
};

export default route;

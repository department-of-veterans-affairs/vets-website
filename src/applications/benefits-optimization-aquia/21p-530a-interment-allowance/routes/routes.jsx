import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from '@bio-aquia/21p-530a-interment-allowance/config/form';
import { App } from '@bio-aquia/21p-530a-interment-allowance/containers/app';

/**
 * Route configuration for the 21P-530a form application
 * @module routes
 */
const route = {
  path: '/',
  component: App,
  indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
  childRoutes: createRoutesWithSaveInProgress(formConfig),
};

export default route;

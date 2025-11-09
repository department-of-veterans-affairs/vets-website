import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import { formConfig } from '@bio-aquia/21-2680-house-bound-status/config';
import App from '@bio-aquia/21-2680-house-bound-status/containers/app';

/**
 * Route configuration for the 21-2680 form application
 * @module routes
 */
const route = {
  path: '/',
  component: App,
  indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
  childRoutes: createRoutesWithSaveInProgress(formConfig),
};

export default route;

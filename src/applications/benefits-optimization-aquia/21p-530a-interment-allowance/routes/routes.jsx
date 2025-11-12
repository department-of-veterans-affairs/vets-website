import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from '@bio-aquia/21p-530a-interment-allowance/config/form';
import ConnectedApp from '../containers/app';

/**
 * Route configuration for the 21P-530a form application
 * @module routes
 */
const route = {
  path: '/',
  component: ConnectedApp,
  indexRoute: { onEnter: (_nextState, replace) => replace('/introduction') },
  childRoutes: createRoutesWithSaveInProgress(formConfig),
};

export default route;

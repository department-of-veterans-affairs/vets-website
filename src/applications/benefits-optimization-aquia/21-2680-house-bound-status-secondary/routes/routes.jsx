import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from '@bio-aquia/21-2680-house-bound-status-secondary/config/form';
import App from '@bio-aquia/21-2680-house-bound-status-secondary/containers/app';

const route = {
  path: '/',
  component: App,
  indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
  childRoutes: createRoutesWithSaveInProgress(formConfig),
};

export default route;

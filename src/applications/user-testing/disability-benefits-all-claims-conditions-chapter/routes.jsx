import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';

import formConfig from './config/form';
import App from './containers/App';

const route = {
  path: '/',
  component: App,
  indexRoute: { onEnter: (_nextState, replace) => replace('/introduction') },
  childRoutes: createRoutesWithSaveInProgress(formConfig),
};

export default route;

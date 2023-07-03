import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfigFn from './config/form';
import App from './containers/App.jsx';

const route = {
  path: '/',
  component: App,
  indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },

  childRoutes: createRoutesWithSaveInProgress(formConfigFn()),
};

export default route;

import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './form/form';
import App from './App.jsx';

const route = {
  path: '/',
  component: App,
  indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },

  childRoutes: createRoutesWithSaveInProgress(formConfig),
};

export default route;

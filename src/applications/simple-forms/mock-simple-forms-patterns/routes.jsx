import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import App from './containers/App.jsx';

const route = {
  path: '/',
  component: App,
  childRoutes: createRoutesWithSaveInProgress(formConfig),
};

export default route;

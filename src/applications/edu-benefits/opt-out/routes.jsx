import { createRoutesWithSaveInProgress } from '../../../platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import OptOutApp from './containers/OptOutApp.jsx';

const route = {
  path: '/',
  component: OptOutApp,
  indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
  childRoutes: createRoutesWithSaveInProgress(formConfig)
};

export default route;

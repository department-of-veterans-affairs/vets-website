import { createRoutesWithSaveInProgress } from '../../../platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import OptOutApp from './containers/OptOutApp.jsx';

const filteredRoutes = new Set(['introduction', 'review-and-submit']);

const childRoutes = createRoutesWithSaveInProgress(formConfig).filter(route => !filteredRoutes.has(route.path));

const route = {
  path: '/',
  component: OptOutApp,
  indexRoute: { onEnter: (nextState, replace) => replace('/form-page') },
  childRoutes
};

export default route;

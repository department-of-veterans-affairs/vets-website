import { createRoutes as createFormRoutes } from '../common/schemaform/helpers';
import formConfig from './config/form';
import HealthCareApp from './HealthCareApp.jsx';

const route = {
  path: '/',
  component: HealthCareApp,
  indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
  childRoutes: createFormRoutes(formConfig)
};

export default route;

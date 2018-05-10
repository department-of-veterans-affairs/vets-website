import { createRoutes as createFormRoutes } from '../common/schemaform/helpers';
import formConfig from './config/form';
import BurialsApp from './BurialsApp.jsx';

const route = {
  path: '/',
  component: BurialsApp,
  indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
  childRoutes: createFormRoutes(formConfig)
};

export default route;

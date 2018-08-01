import { createRoutes as createFormRoutes } from '../common/schemaform/helpers';
import formConfig from './config/form';
import Form4142App from './Form4142App';

const route = {
  path: '/',
  component: Form4142App,
  indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
  childRoutes: createFormRoutes(formConfig)
};

export default route;

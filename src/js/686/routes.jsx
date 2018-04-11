import { createRoutes as createFormRoutes } from '../common/schemaform/helpers';
import formConfig from './config/form';
import Form686App from './containers/Form686App.jsx';

const route = {
  path: '/',
  component: Form686App,
  indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
  childRoutes: createFormRoutes(formConfig)
};

export default route;

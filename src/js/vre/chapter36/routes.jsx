import { createRoutes as createFormRoutes } from '../../common/schemaform/helpers';
import formConfig from './config/form';
import Chapter36App from './Chapter36App.jsx';

const route = {
  path: '/',
  component: Chapter36App,
  indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
  childRoutes: createFormRoutes(formConfig)
};

export default route;

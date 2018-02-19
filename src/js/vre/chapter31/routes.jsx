import { createRoutes as createFormRoutes } from '../../common/schemaform/helpers';
import formConfig from './config/form';
import Chapter31App from './Chapter31App.jsx';

const route = {
  path: '/',
  component: Chapter31App,
  indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
  childRoutes: createFormRoutes(formConfig)
};

export default route;

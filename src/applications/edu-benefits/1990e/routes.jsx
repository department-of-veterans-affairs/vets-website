import { createRoutes as createFormRoutes } from '../../common/schemaform/helpers';
import Form1990eApp from './Form1990eApp';
import formConfig from './config/form';

const routes = [
  {
    path: '/',
    component: Form1990eApp,
    indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
    childRoutes: createFormRoutes(formConfig)
  }
];

export default routes;

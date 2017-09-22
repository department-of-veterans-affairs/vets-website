import { createRoutes as createFormRoutes } from '../../common/schemaform/helpers';
import Form1990nApp from './Form1990nApp';
import formConfig from './config/form';

const routes = [
  {
    path: '/',
    component: Form1990nApp,
    indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
    childRoutes: createFormRoutes(formConfig)
  }
];

export default routes;

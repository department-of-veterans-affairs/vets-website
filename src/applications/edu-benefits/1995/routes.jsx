import { createRoutes as createFormRoutes } from '../../common/schemaform/helpers';
import Form1995App from './Form1995App';
import formConfig from './config/form';

const routes = [
  {
    path: '/',
    component: Form1995App,
    indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
    childRoutes: createFormRoutes(formConfig)
  }
];

export default routes;

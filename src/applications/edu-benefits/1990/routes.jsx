import { createRoutes as createFormRoutes } from '../../common/schemaform/helpers';
import Form1990App from './Form1990App';
import formConfig from './config/form';

const routes = [
  {
    path: '/',
    component: Form1990App,
    indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
    childRoutes: createFormRoutes(formConfig)
  }
];

export default routes;

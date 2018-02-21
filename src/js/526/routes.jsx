import { createRoutes as createFormRoutes } from '../common/schemaform/helpers';
import Form526App from './Form526App';
import formConfig from './config/form';

const routes = [
  {
    path: '/',
    component: Form526App,
    indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
    childRoutes: createFormRoutes(formConfig)
  }
];

export default routes;

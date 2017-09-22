import { createRoutes as createFormRoutes } from '../common/schemaform/helpers';
import Edu1995App from './1995/Form1995App';
import formConfig from './1995/config/form';

const routes = [
  {
    path: '/',
    component: Edu1995App,
    indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
    childRoutes: createFormRoutes(formConfig)
  }
];

export default routes;

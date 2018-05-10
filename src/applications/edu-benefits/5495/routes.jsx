import { createRoutes as createFormRoutes } from '../../common/schemaform/helpers';
import Form5495App from './Form5495App';
import formConfig from './config/form';

const routes = [
  {
    path: '/',
    component: Form5495App,
    indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
    childRoutes: createFormRoutes(formConfig)
  }
];

export default routes;

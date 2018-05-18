import { createRoutes as createFormRoutes } from '../../common/schemaform/helpers';
import Form5490App from './Form5490App';
import formConfig from './config/form';

const routes = [
  {
    path: '/',
    component: Form5490App,
    indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
    childRoutes: createFormRoutes(formConfig)
  }
];

export default routes;

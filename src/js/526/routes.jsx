import { createRoutes as createFormRoutes } from '../common/schemaform/helpers';
import Form526EZApp from './Form526EZApp';
import formConfig from './config/form';

const routes = [
  {
    path: '/',
    component: Form526EZApp,
    indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
    childRoutes: createFormRoutes(formConfig)
  }
];

export default routes;

import { createRoutes as createFormRoutes } from '../common/schemaform/helpers';
import formConfig from './config/form';
import PensionsApp from './PensionsApp.jsx';

const routes = [
  {
    path: '/',
    component: PensionsApp,
    indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
    childRoutes: createFormRoutes(formConfig)
  }
];

export default routes;

import { createRoutes as createFormRoutes } from '../common/schemaform/helpers';
import formConfig from './config/form';
import PensionsApp from './PensionsApp.jsx';

const routes = [
  {
    path: '/',
    indexRoute: { onEnter: (nextState, replace) => replace('/527EZ') }
  },
  {
    path: '/527EZ',
    component: PensionsApp,
    indexRoute: { onEnter: (nextState, replace) => replace('/527EZ/introduction') },
    childRoutes: createFormRoutes(formConfig)
  }
];

export default routes;

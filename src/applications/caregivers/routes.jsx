import { createRoutes } from 'platform/forms-system/src/js/routing.js';
import formConfig from './config/form';
import App from './containers/App.jsx';

const route = {
  path: '/',
  component: App,
  indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },

  childRoutes: createRoutes(formConfig),
};

export default route;

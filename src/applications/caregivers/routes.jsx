import { createRoutes } from 'platform/forms-system/src/js/routing';
import formConfig from './config/form';
import App from './containers/App';

const route = {
  path: '/',
  component: App,
  indexRoute: { onEnter: (_, replace) => replace('/introduction') },
  childRoutes: createRoutes(formConfig),
};

export default route;

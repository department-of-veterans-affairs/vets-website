import { createRoutes } from '@department-of-veterans-affairs/platform-forms-system/routing/createRoutes';
import formConfig from './config/form';
import App from './containers/App';

const route = {
  path: '/',
  component: App,
  indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },

  childRoutes: createRoutes(formConfig),
};

export default route;

import { createRoutes } from 'platform/forms-system/src/js/routing/createRoutes';
import formConfig from './config/form';
import App from './containers/App';

const route = {
  path: '/',
  component: App,
  indexRoute: {
    onEnter: (nextState, replace) => {
      return replace('/introduction');
    },
  },
  childRoutes: createRoutes(formConfig),
};

export default route;

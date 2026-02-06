import { createRoutes } from 'platform/forms-system/src/js/routing/createRoutes';

import RepForm526EZApp from './RepForm526EZApp';
import formConfig from './config/form';

const route = {
  path: '/',
  component: RepForm526EZApp,
  indexRoute: {
    onEnter: (nextState, replace) => replace('/introduction'),
  },
  childRoutes: createRoutes(formConfig),
};

export default route;

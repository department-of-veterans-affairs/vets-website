import { createRoutesWithSaveInProgress } from '@department-of-veterans-affairs/platform-forms/save-in-progress/helpers';

import Form from './containers/Form';
import Search from './containers/Search';
import Welcome from './containers/Welcome';
import RepresentativeApp from './containers/RepresentativeApp';
import formConfig from './config/form';

const routes = {
  path: '/',
  component: RepresentativeApp,
  indexRoute: {
    onEnter: (nextState, replace) => replace('/welcome'),
  },
  childRoutes: [
    { path: 'welcome', component: Welcome },
    { path: 'search', component: Search },
    {
      path: 'form',
      component: Form,
      indexRoute: {
        onEnter: (nextState, replace) => replace('/form/introduction'),
      },

      childRoutes: createRoutesWithSaveInProgress(formConfig),
    },
  ],
};

export default routes;

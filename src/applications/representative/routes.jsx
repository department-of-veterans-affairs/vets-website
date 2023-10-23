import { createRoutesWithSaveInProgress } from '@department-of-veterans-affairs/platform-forms/save-in-progress/helpers';

import Form from './containers/Form';
import SearchPage from './containers/SearchPage';
import HomePage from './containers/HomePage';
import RepresentativeApp from './containers/RepresentativeApp';
import formConfig from './config/form';

const routes = {
  path: '/',
  component: RepresentativeApp,
  indexRoute: {
    onEnter: (nextState, replace) => replace('/welcome'),
  },
  childRoutes: [
    { path: 'welcome', component: HomePage },
    { path: 'search', component: SearchPage },
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

// import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import { createRoutesWithSaveInProgress } from '@department-of-veterans-affairs/platform-forms/save-in-progress/helpers';

import Form from './containers/Form';
import Search from './containers/Search';
import formConfig from './config/form';

const routes = [
  {
    path: '/',
    component: Search,
  },
  {
    path: '/form',
    component: Form,
    indexRoute: {
      onEnter: (nextState, replace) => replace('/form/introduction'),
    },

    childRoutes: createRoutesWithSaveInProgress(formConfig),
  },
];

export default routes;

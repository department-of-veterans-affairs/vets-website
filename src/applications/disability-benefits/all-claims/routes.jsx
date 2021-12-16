import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';

import Form526EZApp from './Form526EZApp';
import formConfig from './config/form';
import WizardContainer from './containers/WizardContainer';

const routes = [
  {
    path: '/start',
    component: WizardContainer,
  },
  {
    path: '/',
    component: Form526EZApp,
    indexRoute: {
      onEnter: (nextState, replace) => replace('/introduction'),
    },
    childRoutes: createRoutesWithSaveInProgress(formConfig),
  },
];

export default routes;

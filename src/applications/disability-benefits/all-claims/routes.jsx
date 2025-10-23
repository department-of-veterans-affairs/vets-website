import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';

import Form526EZApp from './Form526EZApp';
import formConfig from './config/form';
import WizardContainer from './containers/WizardContainer';

// 526 SubTask is incomplete - each nested page will need content and an h2,
// otherwise working - see platform/forms/tests/sub-task/bdd-526.unit.spec.jsx
// import SubTaskContainer from './subtask/SubTaskContainer';

const routes = [
  {
    path: '/start',
    component: WizardContainer, // SubTaskContainer,
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

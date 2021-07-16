import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import { WIZARD_STATUS_COMPLETE } from 'platform/site-wide/wizard';

import Form526EZApp from './Form526EZApp';
import formConfig from './config/form';
import { WIZARD_STATUS } from './constants';
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
      onEnter: (nextState, replace) =>
        replace(
          sessionStorage.getItem(WIZARD_STATUS) === WIZARD_STATUS_COMPLETE
            ? '/introduction'
            : '/start',
        ),
    },
    childRoutes: createRoutesWithSaveInProgress(formConfig),
  },
];

export default routes;

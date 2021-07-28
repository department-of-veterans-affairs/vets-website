import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import { WIZARD_STATUS_COMPLETE } from 'platform/site-wide/wizard';

import Form0996App from './containers/Form0996App';
import WizardContainer from './wizard/WizardContainer';
import { IS_PRODUCTION } from './constants';
import formConfig from './config/form';
import { getHlrWizardStatus } from './wizard/utils';

const start = IS_PRODUCTION
  ? []
  : [
      {
        path: '/start',
        component: WizardContainer,
      },
    ];

const onEnter = IS_PRODUCTION
  ? (nextState, replace) => replace('/introduction')
  : (nextState, replace) =>
      replace(
        getHlrWizardStatus() === WIZARD_STATUS_COMPLETE
          ? '/introduction'
          : '/start',
      );

const routes = [
  ...start,
  {
    path: '/',
    component: Form0996App,
    indexRoute: { onEnter },
    childRoutes: createRoutesWithSaveInProgress(formConfig),
  },
];

export default routes;

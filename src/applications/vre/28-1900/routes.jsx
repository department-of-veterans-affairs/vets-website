import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import { WIZARD_STATUS } from './constants';
import { WIZARD_STATUS_COMPLETE } from 'platform/site-wide/wizard';
import formConfig from './config/form';
import App from './containers/App.jsx';
import FormApp from './containers/FormApp.jsx';

const routes = [
  {
    path: '/orientation',
    component: App,
  },
  {
    path: '/',
    component: FormApp,
    childRoutes: createRoutesWithSaveInProgress(formConfig),
    indexRoute: {
      onEnter: (nextState, replace) => {
        if (sessionStorage.getItem(WIZARD_STATUS) !== WIZARD_STATUS_COMPLETE) {
          replace('/orientation');
        } else {
          replace('/introduction');
        }
      },
    },
  },
];

export default routes;

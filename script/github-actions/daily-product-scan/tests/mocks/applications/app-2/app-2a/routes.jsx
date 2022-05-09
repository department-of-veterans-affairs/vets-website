import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import App from './containers/App.jsx';
import FormApp from './containers/FormApp.jsx';

const routes = [
  {
    path: '/start',
    component: App,
  },
  {
    path: '/',
    component: FormApp,
    childRoutes: createRoutesWithSaveInProgress(formConfig),
    indexRoute: {
      onEnter: (nextState, replace) => replace('/introduction'),
    },
  },
];

export default routes;

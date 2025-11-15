import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import App from './containers/App';
import formConfig from './config/form';

const onEnter = (nextState, replace) => replace('/introduction');

const routes = [
  {
    path: '/',
    component: App,
    indexRoute: { onEnter },
    childRoutes: createRoutesWithSaveInProgress(formConfig),
  },
];

export default routes;

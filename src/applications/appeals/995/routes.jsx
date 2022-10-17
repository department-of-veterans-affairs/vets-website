import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';

import App from './containers/App';
import SubTaskContainer from './subtask/SubTaskContainer';
import formConfig from './config/form';

const onEnter = (nextState, replace) => replace('/introduction');

const routes = [
  {
    path: '/start',
    component: SubTaskContainer,
  },
  {
    path: '/',
    component: App,
    indexRoute: { onEnter },
    childRoutes: createRoutesWithSaveInProgress(formConfig),
  },
];

export default routes;

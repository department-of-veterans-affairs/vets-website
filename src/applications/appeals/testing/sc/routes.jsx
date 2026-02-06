import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import App from './containers/App';

const onEnter = (nextState, replace) => replace('/introduction');

const routes = [
  {
    path: '/',
    component: App,
    indexRoute: { onEnter },
    childRoutes: createRoutesWithSaveInProgress({}),
  },
];

export default routes;

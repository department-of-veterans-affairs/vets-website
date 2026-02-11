import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import Form0996App from './containers/Form0996App';

const onEnter = (nextState, replace) => replace('/introduction');

const routes = [
  {
    path: '/',
    component: Form0996App,
    indexRoute: { onEnter },
    childRoutes: createRoutesWithSaveInProgress({}),
  },
];

export default routes;

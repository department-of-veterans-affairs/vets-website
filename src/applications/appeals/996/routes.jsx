import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
// Trigger e2e tests
import Form0996App from './containers/Form0996App';
import formConfig from './config/form';

const onEnter = (nextState, replace) => replace('/introduction');

const routes = [
  {
    path: '/',
    component: Form0996App,
    indexRoute: { onEnter },
    childRoutes: createRoutesWithSaveInProgress(formConfig),
  },
];

export default routes;

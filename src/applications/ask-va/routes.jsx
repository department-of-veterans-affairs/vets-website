import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import App from './containers/App';
import ResponseInboxPage from './containers/ResponseInboxPage';
import ResponseSentPage from './containers/ResponseSentPage';

const routes = [
  {
    path: '/user/dashboard/:id',
    component: ResponseInboxPage,
  },
  {
    path: '/response-sent',
    component: ResponseSentPage,
  },
  {
    path: '/',
    component: App,
    indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
    childRoutes: createRoutesWithSaveInProgress(formConfig),
  },
];

export default routes;

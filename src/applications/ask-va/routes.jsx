import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import App from './containers/App';
// import ResponseInboxPage from './containers/ResponseInboxPage';
import ResponseSentPage from './containers/ResponseSentPage';
import AlertResponseInboxPage from './containers/AlertResponseInboxPage';

const routes = [
  {
    path: '/user/dashboard/:id',
    component: AlertResponseInboxPage,
    // TODO: replace with ResponseInboxPage after flag for alert with link to the old portal is removed
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

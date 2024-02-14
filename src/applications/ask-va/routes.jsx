import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import App from './containers/App.jsx';
import ProfileTest from './containers/ProfilePage.jsx';
import ResponseInboxPage from './containers/ResponseInboxPage';

const routes = [
  {
    path: '/user/dashboard/:id',
    component: ResponseInboxPage,
  },
  {
    path: '/user/profile-test',
    component: ProfileTest,
  },
  {
    path: '/',
    component: App,
    indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
    childRoutes: createRoutesWithSaveInProgress(formConfig),
  },
];

export default routes;

import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import App from './containers/App';
import ResponseInboxPage from './containers/ResponseInboxPage';
import ResponseInboxPageMock from './containers/ResponseInboxPageMock';

const routes = [
  {
    path: '/user/dashboard/:id',
    component: ResponseInboxPage,
  },
  {
    path: '/user/dashboard-mock/:id',
    component: ResponseInboxPageMock,
  },
  {
    path: '/demo',
    indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
    childRoutes: createRoutesWithSaveInProgress(formConfig),
  },
  {
    path: '/',
    component: App,
    indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
    childRoutes: createRoutesWithSaveInProgress(formConfig),
  },
  {
    path: '/introduction',
    component: App,
    indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
    childRoutes: createRoutesWithSaveInProgress(formConfig),
  },
];

export default routes;

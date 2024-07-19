import { createRoutes } from 'platform/forms-system/src/js/routing';
import formConfig from './config/form';
import App from './containers/App.jsx';
import ResponseInboxPage from './containers/ResponseInboxPage';

const routes = [
  {
    path: '/user/dashboard/:id',
    component: ResponseInboxPage,
  },
  {
    path: '/introduction/',
    component: App,
  },
  {
    path: '/',
    component: App,
    indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
    childRoutes: createRoutes(formConfig),
  },
];

export default routes;

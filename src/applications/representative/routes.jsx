import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import App from './containers/App';
import Form from './containers/form/Form';
import Search from './containers/search/Search';

const routes = [
  {
    path: '/',
    component: App,
  },
  {
    path: '/search',
    component: Search,
  },
  {
    path: '/form',
    component: Form,
    indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
    childRoutes: createRoutesWithSaveInProgress(formConfig),
  },
];

export default routes;

import MessagingApp from './containers/MessagingApp';
import Folder from './containers/Folder';
import Main from './containers/Main';

const routes = {
  path: '/messaging',
  component: MessagingApp,
  childRoutes: [
    {
      component: Main,
      indexRoute: { component: Folder }
    }
    // { path: '/inbox', component: Folder }
  ]
};

export default routes;

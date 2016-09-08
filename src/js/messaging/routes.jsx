import AppMessaging from './containers/AppMessaging';
import Folder from './containers/Folder';
import Main from './containers/Main';

const routes = {
  path: '/messaging',
  component: AppMessaging,
  childRoutes: [
    {
      component: Main,
      indexRoute: { component: Folder }
    }
    // { path: '/inbox', component: Folder }
  ]
};

export default routes;

import Profile from './containers/Profile';
import Main from './containers/Main';
import UserProfileApp from './containers/UserProfileApp';

const routes = {
  path: '/profile',
  component: UserProfileApp,
  childRoutes: [
    {
      component: Main,
      indexRoute: { component: Profile }
    }
  ]
};

export default routes;

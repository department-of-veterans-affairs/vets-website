import Profile from './containers/Profile';
import Notifications from './containers/Notifications';
import Main from './containers/Main';
import UserProfileApp from './containers/UserProfileApp';

const routes = {
  path: '/profile',
  component: UserProfileApp,
  childRoutes: [
    {
      component: Main,
      indexRoute: { component: Profile },
      childRoutes: [
        { path: 'status', component: Notifications }
      ]
    }
  ]
};

export default routes;

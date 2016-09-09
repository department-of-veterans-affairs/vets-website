import MessagingApp from './containers/MessagingApp';
import Folder from './containers/Folder';
import Inbox from './containers/Inbox';
import Main from './containers/Main';

const routes = {
  path: '/messaging',
  component: MessagingApp,
  childRoutes: [
    {
      component: Main,
      indexRoute: { component: Inbox }
    },
    { path: 'inbox', component: Inbox }
  ]
};

export default routes;

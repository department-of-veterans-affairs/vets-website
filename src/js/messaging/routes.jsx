import MessagingApp from './containers/MessagingApp';
import Compose from './containers/Compose';
import Folder from './containers/Folder';
import Main from './containers/Main';
import Thread from './containers/Thread';
import Settings from './containers/Settings';

const routes = {
  path: '/',
  component: MessagingApp,
  indexRoute: {
    onEnter: (nextState, replace) => replace('/inbox')
  },
  childRoutes: [
    {
      path: '',
      component: Main,
      childRoutes: [
        { path: 'compose', component: Compose },
        { path: 'settings', component: Settings },
        { path: ':folderName', component: Folder },
        { path: ':folderName/:messageId', component: Thread },
      ]
    }
  ]
};

export default routes;

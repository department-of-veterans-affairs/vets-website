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
    onEnter: (nextState, replace) => replace('/folder/0')
  },
  childRoutes: [
    {
      path: '',
      component: Main,
      childRoutes: [
        {
          path: 'folder',
          onEnter: (nextState, replace) => { replace('/folder/0'); }
        },
        { path: 'compose', component: Compose },
        { path: 'folder/:id', component: Folder },
        { path: 'thread/:id', component: Thread },
        { path: 'settings', component: Settings }
      ]
    }
  ]
};

export default routes;

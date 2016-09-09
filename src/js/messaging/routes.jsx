import MessagingApp from './containers/MessagingApp';
import Folder from './containers/Folder';
import Main from './containers/Main';

const routes = {
  path: '/messaging',
  component: MessagingApp,
  indexRoute: {
    onEnter: (nextState, replace) => replace('/messaging/folder/0')
  },
  childRoutes: [
    {
      path: '',
      component: Main,
      childRoutes: [
        { path: 'folder/:id', component: Folder }
      ]
    },
    /*
    {
      path: '',
      component: Modal,
      childRoutes: [
        {
          { path: 'compose', component: Compose },
          { path: 'thread/:id', component: Thread }
        }
      ]
    }
    */
  ]
};

export default routes;

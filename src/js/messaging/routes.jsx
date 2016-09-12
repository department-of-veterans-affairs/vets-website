import MessagingApp from './containers/MessagingApp';
import Compose from './containers/Compose';
import Folder from './containers/Folder';
import Main from './containers/Main';
import Modal from './containers/Modal';
import Thread from './containers/Thread';

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
    {
      path: '',
      component: Modal,
      childRoutes: [
        { path: 'compose', component: Compose },
        { path: 'thread/:id', component: Thread }
      ]
    }
  ]
};

export default routes;

import App from './containers/App';
import SCApp from './SCApp';

const onEnter = (nextState, replace) => replace('/introduction');

const routes = [
  {
    path: '/',
    component: SCApp,
    indexRoute: { onEnter },
    childRoutes: [{ path: 'introduction', component: App }],
  },
];

export default routes;

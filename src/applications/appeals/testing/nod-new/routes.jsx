import App from './containers/App';
import NODApp from './NODApp';

const onEnter = (nextState, replace) => replace('/introduction');

const routes = [
  {
    path: '/',
    component: NODApp,
    indexRoute: { onEnter },
    childRoutes: [{ path: 'introduction', component: App }],
  },
];

export default routes;

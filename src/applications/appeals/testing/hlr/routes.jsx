import App from './containers/App';
import HLRApp from './HLRApp';

const onEnter = (nextState, replace) => replace('/introduction');

const routes = [
  {
    path: '/',
    component: HLRApp,
    indexRoute: { onEnter },
    childRoutes: [{ path: 'introduction', component: App }],
  },
];

export default routes;

import Active from './containers/Active';
import Detail from './containers/Detail';
import History from './containers/History';
import Main from './containers/Main';
import RxRefillsApp from './containers/RxRefillsApp';

const routes = {
  path: '/rx',
  component: RxRefillsApp,
  childRoutes: [
    {
      component: Main,
      indexRoute: { component: Active },
      childRoutes: [
        { path: '/history', component: History }
      ]
    },
    { path: '/prescription/:id', component: Detail }
  ]
};

export default routes;

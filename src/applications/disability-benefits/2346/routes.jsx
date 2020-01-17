import App from './containers/App.jsx';
import IntroductionPage from './containers/OrderHistory';

const route = {
  path: '/',
  component: App,
  indexRoute: { component: HomePAge },
  childRoutes: [{ path: '/introduction', component: IntroductionPage }],
};

export default route;

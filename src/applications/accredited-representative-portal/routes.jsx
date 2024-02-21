import App from './containers/App';
import Dashboard from './containers/Dashboard';
import LandingPage from './containers/LandingPage';
import POARequests from './containers/POARequests';

const routes = [
  {
    path: '/poa-requests',
    component: POARequests,
  },
  {
    path: '/dashboard',
    component: Dashboard,
  },
  {
    path: '/',
    component: App,
    childRoutes: [{ indexRoute: { component: LandingPage } }],
  },
];

export default routes;

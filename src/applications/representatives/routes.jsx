import App from './containers/App';
import Dashboard from './containers/Dashboard';
import LandingPage from './containers/LandingPage';
import POARequests from './containers/POARequests';
import PermissionsPage from './containers/PermissionsPage';

const routes = [
  {
    path: '/poa-requests',
    component: App,
    childRoutes: [{ indexRoute: { component: POARequests } }],
  },
  {
    path: '/dashboard',
    component: App,
    childRoutes: [{ indexRoute: { component: Dashboard } }],
  },
  {
    path: '/',
    component: LandingPage,
  },
  {
    path: '/permissions',
    component: App,
    childRoutes: [{ indexRoute: { component: PermissionsPage } }],
  },
];

export default routes;

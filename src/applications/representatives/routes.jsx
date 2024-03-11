import App from './containers/App';
import Dashboard from './containers/Dashboard';
import LandingPage from './containers/LandingPage';
import POARequests from './containers/POARequests';
import PermissionsPage from './containers/PermissionsPage';

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
  {
    path: '/permissions',
    component: PermissionsPage,
  },
];

export default routes;

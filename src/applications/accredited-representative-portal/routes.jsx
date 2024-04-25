import App from './containers/App';
import Dashboard from './containers/Dashboard';
import LandingPage from './containers/LandingPage';
import POARequests from './containers/POARequests';
import PermissionsPage from './containers/PermissionsPage';
import SignedInViewLayout from './containers/SignedInViewLayout';

const routes = [
  {
    component: App,
    childRoutes: [
      {
        path: '/',
        component: LandingPage,
      },
      {
        component: SignedInViewLayout,
        childRoutes: [
          {
            path: '/dashboard',
            component: Dashboard,
          },
          {
            path: '/poa-requests',
            component: POARequests,
          },
          {
            path: '/permissions',
            component: PermissionsPage,
          },
        ],
      },
    ],
  },
];

export default routes;

import App from './containers/App';
import DashboardPage from './containers/DashboardPage';
import LandingPage from './containers/LandingPage';
import POARequestsPage from './containers/POARequestsPage';
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
            component: DashboardPage,
          },
          {
            path: '/poa-requests',
            component: POARequestsPage,
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

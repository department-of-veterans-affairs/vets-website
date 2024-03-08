import App from './containers/App';
import Dashboard from './containers/Dashboard';
import LandingPage from './containers/LandingPage';
import POARequests from './containers/POARequests';
import PermissionsPage from './containers/PermissionsPage';
import SignedInViewLayout from './containers/SignedInViewLayout';
import ThirdLevel from './containers/ThirdLevel';
import FourthLevel from './containers/FourthLevel';
import FifthLevel from './containers/FifthLevel';

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
            path: '/permissions/third-va-level-va/fourth-poa-level/fifth-level',
            component: FifthLevel,
          },
          {
            path: '/permissions/third-va-level-va/fourth-poa-level',
            component: FourthLevel,
          },
          {
            path: '/permissions/third-va-level-va',
            component: ThirdLevel,
          },
          {
            path: '/permissions',
            component: PermissionsPage,
          },
        ],
      },
    ],
  },
  {
    path: '/permissions',
    component: PermissionsPage,
  },
];

export default routes;

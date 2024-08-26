import App from './containers/App';
import LandingPage from './containers/LandingPage';
import POARequestsPage from './containers/POARequestsPage';
import SignedInLayoutWrapper from './containers/SignedInLayoutWrapper';

const routes = [
  {
    component: App,
    childRoutes: [
      {
        path: '/',
        component: LandingPage,
      },
      {
        component: SignedInLayoutWrapper,
        childRoutes: [
          {
            path: '/poa-requests',
            component: POARequestsPage,
          },
        ],
      },
    ],
  },
];

export default routes;

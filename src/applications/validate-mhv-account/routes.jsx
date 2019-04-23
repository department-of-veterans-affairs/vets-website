import ValidateMHVAccount from './containers/ValidateMHVAccount';
import ErrorMessage from './containers/ErrorMessage';
import VerifyIdentity from './containers/VerifyIdentity';

const routes = {
  childRoutes: [
    { path: '/', component: ValidateMHVAccount },
    { path: 'verify', component: VerifyIdentity },
    { path: 'error', component: ErrorMessage },
    { path: 'error/:errorCode', component: ErrorMessage },
  ],
};

export default routes;

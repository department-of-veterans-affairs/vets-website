import ValidateMHVAccount from './containers/ValidateMHVAccount';
import ErrorMessage from './containers/ErrorMessage';
import VerifyIdentity from './containers/VerifyIdentity';
import CreateMHVAccount from './containers/CreateMHVAccount';
import UpgradeMHVAccount from './containers/UpgradeMHVAccount';
import Main from './containers/Main';

const routes = {
  component: Main,
  childRoutes: [
    { path: '/', component: ValidateMHVAccount },
    { path: 'verify', component: VerifyIdentity },
    { path: 'create-account', component: CreateMHVAccount },
    { path: 'upgrade-account', component: UpgradeMHVAccount },
    { path: 'error', component: ErrorMessage },
    { path: 'error/:errorCode', component: ErrorMessage },
  ],
};

export default routes;

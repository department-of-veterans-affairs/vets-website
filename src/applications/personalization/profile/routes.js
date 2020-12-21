import AccountSecurity from './components/account-security/AccountSecurity';
import PersonalInformation from './components/personal-information/PersonalInformation';
import MilitaryInformation from './components/military-information/MilitaryInformation';
import DirectDepositWrapper from './components/direct-deposit/DirectDepositWrapper';
import ConnectedApplications from './components/connected-apps/ConnectedApps';
import { PROFILE_PATHS, PROFILE_PATH_NAMES } from './constants';

const getRoutes = options => {
  let routes = [
    {
      component: PersonalInformation,
      name: PROFILE_PATH_NAMES.PERSONAL_INFORMATION,
      path: PROFILE_PATHS.PERSONAL_INFORMATION,
      requiresLOA3: true,
      requiresMVI: true,
    },
    {
      component: MilitaryInformation,
      name: PROFILE_PATH_NAMES.MILITARY_INFORMATION,
      path: PROFILE_PATHS.MILITARY_INFORMATION,
      requiresLOA3: true,
      requiresMVI: true,
    },
    {
      component: DirectDepositWrapper,
      name: PROFILE_PATH_NAMES.DIRECT_DEPOSIT,
      path: PROFILE_PATHS.DIRECT_DEPOSIT,
      requiresLOA3: true,
      requiresMVI: true,
    },
    {
      component: AccountSecurity,
      name: PROFILE_PATH_NAMES.ACCOUNT_SECURITY,
      path: PROFILE_PATHS.ACCOUNT_SECURITY,
      requiresLOA3: false,
      requiresMVI: false,
    },
    {
      component: ConnectedApplications,
      name: PROFILE_PATH_NAMES.CONNECTED_APPLICATIONS,
      path: PROFILE_PATHS.CONNECTED_APPLICATIONS,
      requiresLOA3: true,
      requiresMVI: true,
    },
  ];

  if (options.removeDirectDeposit) {
    routes = routes.filter(route => route.component !== DirectDepositWrapper);
  }

  return routes;
};

export default getRoutes;

import AccountSecurity from './components/AccountSecurity';
import PersonalInformation from './components/personal-information/PersonalInformation';
import MilitaryInformation from './components/MilitaryInformation';
import DirectDeposit from './components/direct-deposit/DirectDeposit';
import ConnectedApplications from './components/connected-apps/ConnectedApps';
import { PROFILE_PATHS, PROFILE_PATH_NAMES } from './constants';

const DirectDepositRoute = {
  component: DirectDeposit,
  name: PROFILE_PATH_NAMES.DIRECT_DEPOSIT,
  path: PROFILE_PATHS.DIRECT_DEPOSIT,
  requiresLOA3: true,
  requiresMVI: true,
};

const MilitaryInformationRoute = {
  component: MilitaryInformation,
  name: PROFILE_PATH_NAMES.MILITARY_INFORMATION,
  path: PROFILE_PATHS.MILITARY_INFORMATION,
  requiresLOA3: true,
  requiresMVI: true,
};

const PersonalInformationRoute = {
  component: PersonalInformation,
  name: PROFILE_PATH_NAMES.PERSONAL_INFORMATION,
  path: PROFILE_PATHS.PERSONAL_INFORMATION,
  requiresLOA3: true,
  requiresMVI: true,
};

const AccountSecurityRoute = {
  component: AccountSecurity,
  name: PROFILE_PATH_NAMES.ACCOUNT_SECURITY,
  path: PROFILE_PATHS.ACCOUNT_SECURITY,
  requiresLOA3: false,
  requiresMVI: false,
};

const ConnectedApplicationsRoute = {
  component: ConnectedApplications,
  name: PROFILE_PATH_NAMES.CONNECTED_APPLICATIONS,
  path: PROFILE_PATHS.CONNECTED_APPLICATIONS,
  requiresLOA3: true,
  requiresMVI: true,
};

const getRoutes = config => {
  let routes = [
    PersonalInformationRoute,
    MilitaryInformationRoute,
    DirectDepositRoute,
    AccountSecurityRoute,
    ConnectedApplicationsRoute,
  ];

  if (!config.showDirectDeposit) {
    routes = routes.filter(
      route => route.name !== PROFILE_PATH_NAMES.DIRECT_DEPOSIT,
    );
  }

  if (!config.showMilitaryInformation) {
    routes = routes.filter(
      route => route.name !== PROFILE_PATH_NAMES.MILITARY_INFORMATION,
    );
  }

  return routes;
};

export default getRoutes;

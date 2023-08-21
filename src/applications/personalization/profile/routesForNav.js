import AccountSecurity from './components/account-security/AccountSecurity';
import ContactInformation from './components/contact-information/ContactInformation';
import PersonalInformation from './components/personal-information/PersonalInformation';
import MilitaryInformation from './components/military-information/MilitaryInformation';
import DirectDeposit from './components/direct-deposit/DirectDeposit';
import ConnectedApplications from './components/connected-apps/ConnectedApps';
import NotificationSettings from './components/notification-settings/NotificationSettings';
import { PROFILE_PATHS, PROFILE_PATH_NAMES } from './constants';

// the routesForNav array is used in the routes file to build the routes
// the edit route is not present in the routesForNav array because
// it is never used within the nav UI itself
export const routesForNav = [
  {
    component: PersonalInformation,
    name: PROFILE_PATH_NAMES.PERSONAL_INFORMATION,
    path: PROFILE_PATHS.PERSONAL_INFORMATION,
    requiresLOA3: true,
    requiresMVI: true,
  },
  {
    component: ContactInformation,
    name: PROFILE_PATH_NAMES.CONTACT_INFORMATION,
    path: PROFILE_PATHS.CONTACT_INFORMATION,
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
    component: DirectDeposit,
    name: PROFILE_PATH_NAMES.DIRECT_DEPOSIT,
    path: PROFILE_PATHS.DIRECT_DEPOSIT,
    requiresLOA3: true,
    requiresMVI: true,
  },
  {
    component: NotificationSettings,
    name: PROFILE_PATH_NAMES.NOTIFICATION_SETTINGS,
    path: PROFILE_PATHS.NOTIFICATION_SETTINGS,
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

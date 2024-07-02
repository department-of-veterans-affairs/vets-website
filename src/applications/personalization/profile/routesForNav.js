import AccountSecurity from './components/account-security/AccountSecurity';
import ContactInformation from './components/contact-information/ContactInformation';
import PersonalInformation from './components/personal-information/PersonalInformation';
import MilitaryInformation from './components/military-information/MilitaryInformation';
import DirectDeposit from './components/direct-deposit/legacy/DirectDeposit';
import { DirectDeposit as DirectDepositNew } from './components/direct-deposit/DirectDeposit';
import ConnectedApplications from './components/connected-apps/ConnectedApps';
import NotificationSettings from './components/notification-settings/NotificationSettings';
import { PROFILE_PATHS, PROFILE_PATH_NAMES } from './constants';
import PersonalHealthCareContacts from './components/personal-health-care-contacts';

// the routesForNav array is used in the routes file to build the routes
// the edit and hub routes are not present in the routesForNav array because
// they are not shown in nav UI
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
    component: PersonalHealthCareContacts,
    name: PROFILE_PATH_NAMES.CONTACTS,
    path: PROFILE_PATHS.CONTACTS,
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

export const getRoutesForNav = (
  { profileShowDirectDepositSingleForm = false } = {
    profileShowDirectDepositSingleForm: false,
  },
) => {
  return routesForNav.reduce((acc, route) => {
    // use the new direct deposit root route component if profileShowDirectDepositSingleForm flag is true
    if (
      profileShowDirectDepositSingleForm &&
      route.name === PROFILE_PATH_NAMES.DIRECT_DEPOSIT
    ) {
      acc.push({ ...route, component: DirectDepositNew });
      return acc;
    }

    acc.push(route);
    return acc;
  }, []);
};

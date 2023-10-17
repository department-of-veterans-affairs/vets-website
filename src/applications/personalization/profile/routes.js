import AccountSecurity from './components/account-security/AccountSecurity';
import ContactInformation from './components/contact-information/ContactInformation';
import PersonalInformation from './components/personal-information/PersonalInformation';
import MilitaryInformation from './components/military-information/MilitaryInformation';
import DirectDeposit from './components/direct-deposit/DirectDeposit';
import ConnectedApplications from './components/connected-apps/ConnectedApps';
import NotificationSettings from './components/notification-settings/NotificationSettings';
// import { Edit as EditComponent } from './components/edit/Edit';
import { Hub } from './components/hub/Hub';
import { PROFILE_PATHS, PROFILE_PATH_NAMES } from './constants';

// routes displayed in the left-nav and hub page.
// add a 'toggleName' property and value to feature toggle a route.
export const navRoutes = [
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

// other application routes that should not be shown in the left-nav
export const otherRoutes = [
  {
    component: 'Edit',
    name: PROFILE_PATH_NAMES.EDIT,
    path: PROFILE_PATHS.EDIT,
    requiresLOA3: true,
    requiresMVI: true,
    toggleName: 'useFieldEditingPage',
  },
  {
    component: Hub,
    name: PROFILE_PATH_NAMES.PROFILE_ROOT,
    path: PROFILE_PATHS.PROFILE_ROOT,
    requiresLOA3: true,
    requiresMVI: true,
    toggleName: 'profileUseHubPage',
  },
];

/**
 * Filter navigation routes based on toggleName property.
 * @param {Object} toggles - Feature toggles object
 * @param {Array} routes - Optional list of routes to filter
 * @returns {Array} - Navitagtion routes filtered by feature toggle
 */
export const getNavRoutes = (toggles = {}, routes = navRoutes) =>
  routes.filter(({ toggleName }) => !toggleName || toggles[toggleName]);

/**
 * Filter all routes based on toggleName property.
 * @param {Object} toggles - Feature toggles object
 * @returns {Array} - Application routes filtered by feature toggle
 */
export const getAllRoutes = (toggles = {}) =>
  navRoutes
    .concat(otherRoutes)
    .filter(({ toggleName }) => !toggleName || toggles[toggleName]);

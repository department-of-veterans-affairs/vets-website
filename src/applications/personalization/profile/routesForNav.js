import AccountSecurity from './components/account-security/AccountSecurity';
import ContactInformation from './components/contact-information/ContactInformation';
import PersonalInformation from './components/personal-information/PersonalInformation';
import MilitaryInformation from './components/military-information/MilitaryInformation';
import VeteranStatus from './components/veteran-status-card/VeteranStatus';
import AccreditedRepresentative from './components/accredited-representative/AccreditedRepresentative';
import { DirectDeposit } from './components/direct-deposit/DirectDeposit';
import DependentsAndContacts from './components/DependentsAndContacts';
import ConnectedApplications from './components/connected-apps/ConnectedApps';
import NotificationSettings from './components/notification-settings/NotificationSettings';
import { PROFILE_PATHS, PROFILE_PATH_NAMES } from './constants';
import PersonalHealthCareContacts from './components/personal-health-care-contacts';
import BlankPageTemplate from './components/BlankPageTemplate';
import FinancialInformation from './components/FinancialInformation';
import HealthCareSettings from './components/HealthCareSettings';
import LettersAndDocuments from './components/LettersAndDocuments';
import AccountSecurityPage from './components/AccountSecurity';
import AppointmentPreferences from './components/health-care-settings/AppointmentPreferences';

// the routesForNav array is used in the routes file to build the routes
// the edit and hub routes are not present in the routesForNav array because
// they are not shown in nav UI
// subnavParent should be specified for routes that should appear inside a submenu
const routesForNav = [
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
    component: VeteranStatus,
    name: PROFILE_PATH_NAMES.VETERAN_STATUS_CARD,
    path: PROFILE_PATHS.VETERAN_STATUS_CARD,
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
    component: AccreditedRepresentative,
    name: PROFILE_PATH_NAMES.ACCREDITED_REPRESENTATIVE,
    path: PROFILE_PATHS.ACCREDITED_REPRESENTATIVE,
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

const routesForProfile2Nav = [
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
    name: PROFILE_PATH_NAMES.SERVICE_HISTORY_INFORMATION,
    path: PROFILE_PATHS.SERVICE_HISTORY_INFORMATION,
    requiresLOA3: true,
    requiresMVI: true,
  },
  {
    component: FinancialInformation,
    name: PROFILE_PATH_NAMES.FINANCIAL_INFORMATION,
    path: PROFILE_PATHS.FINANCIAL_INFORMATION,
    requiresLOA3: true,
    requiresMVI: true,
    hasSubnav: true,
  },
  {
    component: DirectDeposit,
    name: PROFILE_PATH_NAMES.DIRECT_DEPOSIT,
    path: PROFILE_PATHS.DIRECT_DEPOSIT,
    requiresLOA3: true,
    requiresMVI: true,
    subnavParent: PROFILE_PATH_NAMES.FINANCIAL_INFORMATION,
  },
  {
    component: HealthCareSettings,
    name: PROFILE_PATH_NAMES.HEALTH_CARE_SETTINGS,
    path: PROFILE_PATHS.HEALTH_CARE_SETTINGS,
    requiresLOA3: true,
    requiresMVI: true,
    hasSubnav: true,
    featureFlag: 'profileHealthCareSettingsPage',
  },
  {
    component: AppointmentPreferences,
    name: PROFILE_PATH_NAMES.APPOINTMENT_PREFERENCES,
    path: PROFILE_PATHS.APPOINTMENT_PREFERENCES,
    requiresLOA3: true,
    requiresMVI: true,
    subnavParent: PROFILE_PATH_NAMES.HEALTH_CARE_SETTINGS,
    featureFlag: 'profileHealthCareSettingsPage',
  },
  {
    component: PersonalHealthCareContacts,
    name: PROFILE_PATH_NAMES.HEALTH_CARE_CONTACTS,
    path: PROFILE_PATHS.HEALTH_CARE_CONTACTS,
    requiresLOA3: true,
    requiresMVI: true,
    subnavParent: PROFILE_PATH_NAMES.HEALTH_CARE_SETTINGS,
    featureFlag: 'profileHealthCareSettingsPage',
  },
  {
    component: BlankPageTemplate, // TODO implement before Profile 2.0 launch
    name: PROFILE_PATH_NAMES.SECURE_MESSAGES_SIGNATURE,
    path: PROFILE_PATHS.SECURE_MESSAGES_SIGNATURE,
    requiresLOA3: true,
    requiresMVI: true,
    subnavParent: PROFILE_PATH_NAMES.HEALTH_CARE_SETTINGS,
    featureFlag: 'profileHealthCareSettingsPage',
  },
  {
    component: DependentsAndContacts,
    name: PROFILE_PATH_NAMES.DEPENDENTS_AND_CONTACTS,
    path: PROFILE_PATHS.DEPENDENTS_AND_CONTACTS,
    requiresLOA3: true,
    requiresMVI: true,
    hasSubnav: true,
  },
  {
    component: AccreditedRepresentative,
    name: PROFILE_PATH_NAMES.ACCREDITED_REPRESENTATIVE,
    path: PROFILE_PATHS.ACCREDITED_REPRESENTATIVE,
    requiresLOA3: true,
    requiresMVI: true,
    subnavParent: PROFILE_PATH_NAMES.DEPENDENTS_AND_CONTACTS,
  },
  {
    component: LettersAndDocuments,
    name: PROFILE_PATH_NAMES.LETTERS_AND_DOCUMENTS,
    path: PROFILE_PATHS.LETTERS_AND_DOCUMENTS,
    requiresLOA3: true,
    requiresMVI: true,
    hasSubnav: true,
  },
  {
    component: VeteranStatus,
    name: PROFILE_PATH_NAMES.VETERAN_STATUS_CARD,
    path: PROFILE_PATHS.VETERAN_STATUS_CARD,
    requiresLOA3: true,
    requiresMVI: true,
    subnavParent: PROFILE_PATH_NAMES.LETTERS_AND_DOCUMENTS,
  },
  {
    component: NotificationSettings,
    name: PROFILE_PATH_NAMES.EMAIL_AND_TEXT_NOTIFICATIONS,
    path: PROFILE_PATHS.EMAIL_AND_TEXT_NOTIFICATIONS,
    requiresLOA3: true,
    requiresMVI: true,
  },
  {
    component: AccountSecurityPage,
    name: PROFILE_PATH_NAMES.ACCOUNT_SECURITY,
    path: PROFILE_PATHS.ACCOUNT_SECURITY,
    requiresLOA3: false,
    hasSubnav: true,
  },
  {
    component: ConnectedApplications,
    name: PROFILE_PATH_NAMES.CONNECTED_APPLICATIONS,
    path: PROFILE_PATHS.CONNECTED_APPLICATIONS,
    requiresLOA3: true,
    requiresMVI: true,
    subnavParent: PROFILE_PATH_NAMES.ACCOUNT_SECURITY,
  },
  {
    component: AccountSecurity,
    name: PROFILE_PATH_NAMES.SIGNIN_INFORMATION,
    path: PROFILE_PATHS.SIGNIN_INFORMATION,
    requiresLOA3: false,
    subnavParent: PROFILE_PATH_NAMES.ACCOUNT_SECURITY,
  },
];

export const getRoutesForNav = (
  { profile2Enabled = false, profileHealthCareSettingsPage = false } = {
    profile2Enabled: false,
    profileHealthCareSettingsPage: false,
  },
) => {
  if (profile2Enabled) {
    return routesForProfile2Nav.filter(route => {
      // filter out routes based on feature flags
      if (route.featureFlag === 'profileHealthCareSettingsPage') {
        return profileHealthCareSettingsPage;
      }
      return true;
    });
  }

  return routesForNav;
};

export const routeHasParent = (route, routes) => {
  const matchedRoute = routes.find(r => r.path === route.path);
  return Boolean(matchedRoute?.subnavParent);
};

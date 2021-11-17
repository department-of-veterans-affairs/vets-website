import AccountSecurity from './components/account-security/AccountSecurity';
import ContactInformation from './components/contact-information/ContactInformation';
import PersonalInformation from './components/personal-information/PersonalInformation';
import MilitaryInformation from './components/military-information/MilitaryInformation';
import DirectDeposit from './components/direct-deposit/DirectDeposit';
import ConnectedApplications from './components/connected-apps/ConnectedApps';
import NotificationSettings from './components/notification-settings/NotificationSettings';
import {
  PROFILE_PATHS,
  PROFILE_PATH_NAMES,
  PROFILE_PATH_NAMES_LGBTQ_ENHANCEMENT,
  PROFILE_PATHS_LGBTQ_ENHANCEMENT,
} from './constants';

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

  if (options.removeDirectDeposit) {
    routes = routes.filter(
      route => route.name !== PROFILE_PATH_NAMES.DIRECT_DEPOSIT,
    );
  }

  if (options.removeNotificationSettings) {
    routes = routes.filter(
      route => route.name !== PROFILE_PATH_NAMES.NOTIFICATION_SETTINGS,
    );
  }

  if (options.shouldShowProfileLGBTQEnhancements) {
    const personalInformation = {
      component: PersonalInformation,
      name: PROFILE_PATH_NAMES_LGBTQ_ENHANCEMENT.PERSONAL_INFORMATION,
      path: PROFILE_PATHS_LGBTQ_ENHANCEMENT.PERSONAL_INFORMATION,
      requiresLOA3: true,
      requiresMVI: true,
    };
    const contactInformation = {
      component: ContactInformation,
      name: PROFILE_PATH_NAMES_LGBTQ_ENHANCEMENT.CONTACT_INFORMATION,
      path: PROFILE_PATHS_LGBTQ_ENHANCEMENT.CONTACT_INFORMATION,
      requiresLOA3: true,
      requiresMVI: true,
    };
    routes.splice(0, 1, personalInformation);
    routes.splice(1, 0, contactInformation);
  }

  return routes;
};

export default getRoutes;

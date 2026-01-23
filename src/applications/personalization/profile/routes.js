import { PROFILE_PATHS, PROFILE_PATH_NAMES } from './constants';
import { Edit } from './components/edit/Edit';
import { getRoutesForNav } from './routesForNav';
import { Hub } from './components/hub/Hub';
import ProfileHub from './components/hub/ProfileHub';
import { ContactMethodContainer } from './components/health-care-settings/sub-tasks/contact-method/ContactMethodContainer';
import AppointmentTimesWrapper from './components/health-care-settings/sub-tasks/AppointmentTimesWrapper';
import ContactTimesWrapper from './components/health-care-settings/sub-tasks/ContactTimesWrapper';

const getRoutes = (
  {
    profile2Enabled = false,
    profileHealthCareSettingsPage = false,
    profileHideHealthCareContacts = false,
  } = {
    profile2Enabled: false,
    profileHealthCareSettingsPage: false,
    profileHideHealthCareContacts: false,
  },
) => {
  return [
    ...getRoutesForNav({
      profile2Enabled,
      profileHealthCareSettingsPage,
      profileHideHealthCareContacts,
    }),
    {
      component: Edit,
      name: PROFILE_PATH_NAMES.EDIT,
      path: PROFILE_PATHS.EDIT,
      requiresLOA3: true,
      requiresMVI: true,
    },
    {
      component: profile2Enabled ? ProfileHub : Hub,
      name: PROFILE_PATH_NAMES.PROFILE_ROOT,
      path: PROFILE_PATHS.PROFILE_ROOT,
      requiresLOA3: true,
      requiresMVI: true,
    },
    {
      component: ContactMethodContainer,
      name: PROFILE_PATH_NAMES.SCHEDULING_PREF_CONTACT_METHOD,
      path: PROFILE_PATHS.SCHEDULING_PREF_CONTACT_METHOD,
      requiresLOA3: true,
      requiresMVI: true,
    },
    {
      component: ContactTimesWrapper,
      name: PROFILE_PATH_NAMES.SCHEDULING_PREF_CONTACT_TIME,
      path: PROFILE_PATHS.SCHEDULING_PREF_CONTACT_TIMES,
      requiresLOA3: true,
      requiresMVI: true,
    },
    {
      component: AppointmentTimesWrapper,
      name: PROFILE_PATH_NAMES.SCHEDULING_PREF_APPOINTMENT_TIME,
      path: PROFILE_PATHS.SCHEDULING_PREF_APPOINTMENT_TIMES,
      requiresLOA3: true,
      requiresMVI: true,
    },
  ];
};

export default getRoutes;

import { PROFILE_PATHS, PROFILE_PATH_NAMES } from './constants';
import { Edit } from './components/edit/Edit';
import { getRoutesForNav } from './routesForNav';
import { Hub } from './components/hub/Hub';
import VeteranStatus from './components/veteran-status/Status';

// conditionally add the edit route based on feature toggle
// conditionally add the profile hub route based on feature toggle
// conditionally add the veteran status route based on feature toggle
const getRoutes = (
  {
    profileContactsPage,
    useFieldEditingPage,
    profileUseHubPage,
    profileShowProofOfVeteranStatus,
  } = {
    profileContactsPage: false,
    useFieldEditingPage: false,
    profileUseHubPage: false,
    profileShowProofOfVeteranStatus: false,
  },
) => {
  return [
    ...getRoutesForNav(profileContactsPage),
    ...(useFieldEditingPage
      ? [
          {
            component: Edit,
            name: PROFILE_PATH_NAMES.EDIT,
            path: PROFILE_PATHS.EDIT,
            requiresLOA3: true,
            requiresMVI: true,
          },
        ]
      : []),
    ...(profileUseHubPage
      ? [
          {
            component: Hub,
            name: PROFILE_PATH_NAMES.PROFILE_ROOT,
            path: PROFILE_PATHS.PROFILE_ROOT,
            requiresLOA3: true,
            requiresMVI: true,
          },
        ]
      : []),
    ...(profileShowProofOfVeteranStatus
      ? [
          {
            component: VeteranStatus,
            name: PROFILE_PATH_NAMES.VETERAN_STATUS,
            path: PROFILE_PATHS.VETERAN_STATUS,
            requiresLOA3: true,
            requiresMVI: true,
          },
        ]
      : []),
  ];
};

export default getRoutes;

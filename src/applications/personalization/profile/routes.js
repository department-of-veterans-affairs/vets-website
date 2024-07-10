import { PROFILE_PATHS, PROFILE_PATH_NAMES } from './constants';
import { Edit } from './components/edit/Edit';
import { getRoutesForNav } from './routesForNav';
import { Hub } from './components/hub/Hub';

// conditionally add the profile hub route based on feature toggle
const getRoutes = (
  { profileShowDirectDepositSingleForm = false } = {
    profileShowDirectDepositSingleForm: false,
  },
) => {
  return [
    ...getRoutesForNav({
      profileShowDirectDepositSingleForm,
    }),
    {
      component: Edit,
      name: PROFILE_PATH_NAMES.EDIT,
      path: PROFILE_PATHS.EDIT,
      requiresLOA3: true,
      requiresMVI: true,
    },
    {
      component: Hub,
      name: PROFILE_PATH_NAMES.PROFILE_ROOT,
      path: PROFILE_PATHS.PROFILE_ROOT,
      requiresLOA3: true,
      requiresMVI: true,
    },
  ];
};

export default getRoutes;

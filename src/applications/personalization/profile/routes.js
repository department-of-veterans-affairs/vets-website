import { PROFILE_PATHS, PROFILE_PATH_NAMES } from './constants';
import { Edit } from './components/edit/Edit';
import { getRoutesForNav } from './routesForNav';

// conditionally add the edit route based on feature toggle
// conditionally add the profile hub route based on feature toggle
const getRoutes = (
  { useFieldEditingPage, profileUseHubPage } = {
    useFieldEditingPage: false,
    profileUseHubPage: false,
  },
) => {
  return [
    ...getRoutesForNav({ profileUseHubPage }),
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
  ];
};

export default getRoutes;

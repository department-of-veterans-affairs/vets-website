import { PROFILE_PATHS, PROFILE_PATH_NAMES } from './constants';
import { Edit } from './components/edit/Edit';
import { routesForNav } from './routesForNav';

// condtionally add the edit route based on feature toggle
const getRoutes = (
  { useFieldEditingPage } = { useFieldEditingPage: false },
) => {
  return [
    ...routesForNav,
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

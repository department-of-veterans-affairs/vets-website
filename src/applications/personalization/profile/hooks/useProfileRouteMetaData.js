import { useLocation } from 'react-router-dom';
import { PROFILE_PATHS_WITH_NAMES } from '../constants';
import { getRouteInfoFromPath } from '../../common/helpers';

export const useProfileRouteMetaData = () => {
  const { pathname } = useLocation();
  return (() => {
    try {
      return getRouteInfoFromPath(pathname, PROFILE_PATHS_WITH_NAMES);
    } catch (e) {
      return PROFILE_PATHS_WITH_NAMES.PROFILE_ROOT;
    }
  })();
};

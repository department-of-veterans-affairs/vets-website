import { useEffect } from 'react';
import { setDocumentTitle } from '../utils/helpers';

const useHeaderPageTitle = location => {
  useEffect(
    () => {
      if (location) {
        setDocumentTitle(location);
      }
    },
    [location],
  ); // Only rerun when location.pathname changes
};

export default useHeaderPageTitle;

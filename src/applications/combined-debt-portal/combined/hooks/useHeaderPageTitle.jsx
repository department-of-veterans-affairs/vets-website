import { useEffect } from 'react';

export const setDocumentTitle = title => {
  document.title = `${title} | Veterans Affairs`;
};

const useHeaderPageTitle = location => {
  useEffect(() => {
    if (location) {
      setDocumentTitle(location);
    }
  }, [location]); // Only rerun when location.pathname changes
};

export default useHeaderPageTitle;

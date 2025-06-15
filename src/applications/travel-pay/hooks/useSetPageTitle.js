import { useEffect } from 'react';

const useSetPageTitle = title => {
  useEffect(
    () => {
      if (title) {
        document.title = `${title} | Veterans Affairs`;
      }
    },
    [title],
  );
};

export default useSetPageTitle;

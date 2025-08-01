import { useEffect } from 'react';

const useSetPageTitle = title => {
  useEffect(
    () => {
      if (title) {
        document.title = `${title} - Travel Pay | Veterans Affairs`;
      }
    },
    [title],
  );
};

export default useSetPageTitle;

import { useCallback } from 'react';

import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { useHistory } from 'react-router-dom';

export default function useHandleKeyDown({ link, idClickable }) {
  const history = useHistory();

  return useCallback(
    () => {
      return event => {
        if (event.key === 'Space' || event.code === 'Space') {
          focusElement(`#${idClickable}`);
          history.push(link);
        }
      };
    },
    [history, idClickable, link],
  );
}

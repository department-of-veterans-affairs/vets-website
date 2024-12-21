// import { focusElement } from 'platform/utilities/ui';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';

import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

export default function useHandleClick({ link, idClickable }) {
  const history = useHistory();

  return useCallback(
    () => {
      return () => {
        focusElement(`#${idClickable}`);
        history.push(link);
      };
    },
    [history, idClickable, link],
  );
}

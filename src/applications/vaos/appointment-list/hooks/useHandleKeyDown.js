import { useCallback } from 'react';

import { focusElement } from 'platform/utilities/ui';
import { useHistory } from 'react-router-dom';
import { SPACE_BAR } from '../../utils/constants';

export default function useHandleKeyDown({ link, idClickable }) {
  const history = useHistory();

  return useCallback(
    () => {
      return event => {
        if (!window.getSelection().toString() && event.keyCode === SPACE_BAR) {
          focusElement(`#${idClickable}`);
          history.push(link);
        }
      };
    },
    [history, idClickable, link],
  );
}

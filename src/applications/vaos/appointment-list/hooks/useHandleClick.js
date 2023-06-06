import { focusElement } from 'platform/utilities/ui';
import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

export default function useHandleClick({ link, idClickable }) {
  const history = useHistory();

  return useCallback(
    () => {
      return () => {
        if (!window.getSelection().toString()) {
          focusElement(`#${idClickable}`);
          history.push(link);
        }
      };
    },
    [history, idClickable, link],
  );
}

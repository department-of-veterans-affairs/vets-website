import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

export const useMyHealthAccessGuard = () => {
  const history = useHistory();
  const mhvAccountState = useSelector(
    state => state?.user?.profile?.mhvAccountState,
  );

  useEffect(
    () => {
      if (mhvAccountState === 'NONE') {
        history.push('/my-health');
      }
    },
    [mhvAccountState, history],
  );

  return null;
};

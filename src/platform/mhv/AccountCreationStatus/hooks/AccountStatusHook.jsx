import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getMHVAccount } from '../util/api';

import { fetchAccountStatus, fetchAccountStatusSuccess } from '../reducer';

export const AccountStatusHook = (profile, userHasMhvAccount) => {
  const dispatch = useDispatch();

  useEffect(
    () => {
      if (!profile.loading) {
        if (userHasMhvAccount) {
          dispatch({
            type: fetchAccountStatusSuccess,
            data: { error: false },
          });
        } else {
          dispatch({ type: fetchAccountStatus });

          getMHVAccount().then(resp => {
            dispatch({
              type: fetchAccountStatusSuccess,
              data: resp,
            });
          });
        }
      }
    },
    [userHasMhvAccount, profile.loading, dispatch],
  );
};

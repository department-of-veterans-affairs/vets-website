import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { UPDATE_MHV_STATE_VALUE } from 'platform/user/profile/actions';
import { getMHVAccount } from '../utilities/api';
import { isLOA3, selectProfile, hasMhvAccount } from '../selectors';
import {
  fetchAccountStatus,
  fetchAccountStatusSuccess,
} from '../reducers/account';

// eslint-disable-next-line react-hooks/rules-of-hooks
export function useAccountCreationApi(dispatchFunction = useDispatch()) {
  const dispatch = dispatchFunction;
  const profile = useSelector(selectProfile);
  const userVerified = useSelector(isLOA3);
  const userHasMhvAccount = useSelector(hasMhvAccount);

  useEffect(
    () => {
      if (!profile.loading && userVerified) {
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
            dispatch({
              type: UPDATE_MHV_STATE_VALUE,
              accountState: resp.errors ? 'ERROR' : 'OK',
            });
          });
        }
      }
    },
    [userHasMhvAccount, profile.loading, userVerified, dispatch],
  );
}

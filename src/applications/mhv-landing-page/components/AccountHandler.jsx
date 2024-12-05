import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { getMHVAccount } from '../utilities/api';
import {
  mhvAccountStatusLoading,
  mhvAccountStatusUserError,
  hasMhvAccount,
} from '../selectors';

const AccountHandler = ({ MHVAccountStatusFetchComplete }) => {
  const mhvAccountStatusIsLoading = useSelector(mhvAccountStatusLoading);
  const mhvAccountStatusUserErrors = useSelector(mhvAccountStatusUserError);

  const dispatch = useDispatch();
  const userHasMhvAccount = useSelector(hasMhvAccount);

  useEffect(
    () => {
      if (userHasMhvAccount) {
        dispatch({
          type: 'fetchAccountStatusSuccess',
          data: { error: false },
        });
      } else {
        dispatch({ type: 'fetchAccountStatus' });

        getMHVAccount().then(resp => {
          dispatch({
            type: 'fetchAccountStatusSuccess',
            data: resp,
          });
        });
      }
    },
    [userHasMhvAccount, MHVAccountStatusFetchComplete],
  );

  if (mhvAccountStatusIsLoading) {
    return (
      <div>
        <va-loading-indicator label="Loading" message="thinking..." set-focus />
      </div>
    );
  }
  if (mhvAccountStatusUserErrors.length > 0) {
    return <div>failed with error {mhvAccountStatusUserErrors[0].code}</div>;
  }
  return <div>successfully created MHV account</div>;
};

AccountHandler.defaultProps = {
  MHVAccountStatusFetchComplete: false,
  MHVAccountStatus: {},
};

AccountHandler.propTypes = {
  MHVAccountStatusFetchComplete: PropTypes.bool,
  MHVAccountStatus: PropTypes.object,
};

export default AccountHandler;

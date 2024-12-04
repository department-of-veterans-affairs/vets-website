import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { getMHVAccount } from '../utilities/api';

const AccountHandler = ({ MHVAccountStatusFetchComplete }) => {
  const accountStatus = useSelector(state => state?.myHealth?.accountStatus);
  const dispatch = useDispatch();
  const [state] = useState({ complete: false });

  useEffect(
    () => {
      const hasMHVAccount = ['OK', 'MULTIPLE'].includes(
        state.user?.profile?.mhvAccountState,
      );

      if (hasMHVAccount) {
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
    [MHVAccountStatusFetchComplete],
  );

  if (accountStatus?.loading) {
    return (
      <div>
        <va-loading-indicator label="Loading" message="thinking..." set-focus />
      </div>
    );
  }
  if (accountStatus?.data?.errors) {
    return <div>failed with error {accountStatus?.data.errors[0].code}</div>;
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

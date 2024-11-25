import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getMHVAccount } from '../utilities/api';

const AccountHandler = ({ MHVAccountStatusFetchComplete }) => {
  const [state, setState] = useState({ complete: false });

  useEffect(
    () => {
      getMHVAccount().then(resp => {
        setState({
          complete: true,
          response: resp,
        });
      });
    },
    [MHVAccountStatusFetchComplete],
  );

  if (!state.complete) {
    return (
      <div>
        <va-loading-indicator label="Loading" message="thinking..." set-focus />
      </div>
    );
  }
  if (state.response.errors) {
    return <div>failed with error {state.response.errors[0].code}</div>;
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

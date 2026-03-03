import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const VAPServiceTransactionPending = ({ refreshTransaction, children }) => {
  const intervalRef = useRef(null);

  useEffect(
    () => {
      intervalRef.current = window.setInterval(
        refreshTransaction,
        window.VetsGov.pollTimeout || 1000,
      );

      return () => {
        window.clearInterval(intervalRef.current);
      };
    },
    [refreshTransaction],
  );

  if (children) {
    return <div>{children}</div>;
  }

  const content = (
    <va-loading-indicator
      label="Updating"
      message="Updating your information..."
      set-focus
      data-testid="loading-indicator"
    />
  );

  return <div>{content}</div>;
};

VAPServiceTransactionPending.propTypes = {
  refreshTransaction: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default VAPServiceTransactionPending;

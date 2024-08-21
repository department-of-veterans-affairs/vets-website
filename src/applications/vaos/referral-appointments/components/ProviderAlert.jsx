import React from 'react';
import PropTypes from 'prop-types';
import InfoAlert from '../../components/InfoAlert';

export const ProviderAlert = ({ status }) => {
  return (
    <InfoAlert status={status}>
      <p className="vads-u-margin-y--0">
        You are not authorized to schedule with your indicated provider at this
        time. You can use this tool to schedule with another provider.
      </p>
    </InfoAlert>
  );
};

ProviderAlert.propTypes = {
  status: PropTypes.oneOf(['info', 'error', 'success', 'warning', 'continue'])
    .isRequired,
};

export default ProviderAlert;

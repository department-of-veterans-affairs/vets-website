import React from 'react';
import PropTypes from 'prop-types';

export const AddressDescription = ({ addressType }) => {
  return (
    <div className="vads-u-margin-y--3" style={{ width: '104%' }}>
      {addressType === 'mailing' ? (
        <p style={{ lineHeight: '30px' }}>
          We’ll send any important information about your application to this
          address. Any updates you make here to your address will apply only to
          this application.
        </p>
      ) : (
        <p style={{ lineHeight: '30px' }}>
          Any updates you make here to your address will apply only to this
          application.
        </p>
      )}
    </div>
  );
};

AddressDescription.propTypes = {
  addressType: PropTypes.string,
};

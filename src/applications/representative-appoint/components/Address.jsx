import React from 'react';
import PropTypes from 'prop-types';

export default function Address({ addressData }) {
  return (
    <>
      {addressData.addressLine1}
      <br />
      {addressData.addressLine2 && (
        <>
          {addressData.addressLine2}
          <br />
          {addressData.addressLine3 && (
            <>
              {addressData.addressLine3}
              <br />
            </>
          )}
        </>
      )}
      {addressData.city}, {addressData.stateCode} {addressData.zipCode}
      <br />
    </>
  );
}

Address.propTypes = {
  addressData: PropTypes.object,
};

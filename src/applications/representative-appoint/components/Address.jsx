import React from 'react';
import PropTypes from 'prop-types';

export default function Address({ address }) {
  return (
    <>
      {address.addressLine1}
      <br />
      {address.addressLine2 && (
        <>
          {address.addressLine2}
          <br />
          {address.addressLine3 && (
            <>
              {address.addressLine3}
              <br />
            </>
          )}
        </>
      )}
      {address.city}, {address.stateCode} {address.zipCode}
      <br />
    </>
  );
}

Address.propTypes = {
  address: PropTypes.object,
};

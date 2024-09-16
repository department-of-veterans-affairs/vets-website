import React from 'react';
import PropTypes from 'prop-types';

export default function Address({ address }) {
  return (
    <>
      {address.address1}
      <br />
      {address.address2 && (
        <>
          {address.address2}
          <br />
          {address.address3 && (
            <>
              {address.address3}
              <br />
            </>
          )}
        </>
      )}
      {address.city}, {address.state} {address.zip}
      <br />
    </>
  );
}

Address.propTypes = {
  address: PropTypes.object,
};

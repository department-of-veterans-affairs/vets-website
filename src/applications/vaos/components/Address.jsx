import React from 'react';
import PropTypes from 'prop-types';
import State from './State';

export default function Address({ address }) {
  if (address)
    return (
      <>
        {/* removes falsy values from address array */}
        <span>{address?.line.filter(Boolean).join(', ')}</span>
        <br />
        <span>
          {address.city}, <State state={address.state} /> {address.postalCode}
        </span>
        <br />
      </>
    );

  return null;
}
Address.propTypes = {
  address: PropTypes.object,
};

import React from 'react';
import State from './State';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default function ResidentialAddress({ address, marginTop }) {
  const classes = classNames({
    'vads-u-display--block': true,
    'vads-u-margin-top--3': marginTop,
    'vads-u-margin-bottom--3': true,
  });

  return (
    <>
      <span className={classes}>
        {address.addressLine1}
        <br />
        {!!address.addressLine2 && (
          <>
            address.addressLine2
            <br />
          </>
        )}
        {!!address.addressLine3 && (
          <>
            address.addressLine3
            <br />
          </>
        )}
        {address.city}, <State state={address.stateCode} /> {address.zipCode}
      </span>
    </>
  );
}

ResidentialAddress.propTypes = {
  address: PropTypes.object.isRequired,
  'margin-top': PropTypes.bool,
};

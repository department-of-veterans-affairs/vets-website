import React from 'react';
import PropTypes from 'prop-types';

import AddressEmailPhone from './AddressEmailPhone';

export default function ContactCard({
  repName,
  orgName,
  addressData,
  phone,
  email,
}) {
  return (
    <va-card show-shadow>
      <div className="vads-u-margin-top--1p5 vads-u-display--flex">
        <va-icon icon="account_circle" size="4" />
        <div className="vads-u-margin-left--1">
          <h3 className="vads-u-font-family--serif vads-u-margin-top--0p5">
            {orgName || repName}
          </h3>
          {orgName && repName && <p style={{ marginTop: 0 }}>{repName}</p>}
          <AddressEmailPhone
            addressData={addressData}
            email={email}
            phone={phone}
          />
        </div>
      </div>
    </va-card>
  );
}

ContactCard.propTypes = {
  addressData: PropTypes.object,
  email: PropTypes.string,
  orgName: PropTypes.string,
  phone: PropTypes.string,
  repName: PropTypes.string,
  type: PropTypes.string,
};

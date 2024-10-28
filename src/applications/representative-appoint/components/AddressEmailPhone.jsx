import React from 'react';
import PropTypes from 'prop-types';

import Email from './Email';
import Phone from './Phone';
import GoogleMapLink from './GoogleMapLink';
import { addressExists } from '../utilities/helpers';
import { parsePhoneNumber } from '../utilities/parsePhoneNumber';

export default function AddressEmailPhone({ addressData, phone, email }) {
  const { contact, extension } = parsePhoneNumber(phone);

  const recordContactLinkClick = () => {
    // pending analytics event
  };

  return (
    <div className="vads-u-margin-top--3">
      {addressExists(addressData) && (
        <GoogleMapLink
          addressData={addressData}
          recordClick={recordContactLinkClick}
        />
      )}
      {email && <Email email={email} recordClick={recordContactLinkClick} />}
      {contact && (
        <Phone
          contact={contact}
          extension={extension}
          recordClick={recordContactLinkClick}
        />
      )}
    </div>
  );
}

AddressEmailPhone.propTypes = {
  addressData: PropTypes.object,
  email: PropTypes.string,
  phone: PropTypes.string,
};

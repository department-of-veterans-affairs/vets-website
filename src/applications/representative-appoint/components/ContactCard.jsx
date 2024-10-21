import React from 'react';
import PropTypes from 'prop-types';

import Email from './Email';
import Phone from './Phone';
import GoogleMapLink from './GoogleMapLink';
import { addressExists } from '../utilities/helpers';
import { parsePhoneNumber } from '../utilities/parsePhoneNumber';

export default function ContactCard({
  repName,
  orgName,
  address,
  phone,
  email,
}) {
  const { contact, extension } = parsePhoneNumber(phone);

  const recordContactLinkClick = () => {
    // pending analytics event
  };

  return (
    <va-card show-shadow>
      <div className="vads-u-margin-top--1p5 vads-u-display--flex">
        <va-icon icon="account_circle" size="4" />
        <div className="vads-u-margin-left--1">
          <h3 className="vads-u-font-family--serif vads-u-margin-top--0p5">
            {orgName || repName}
          </h3>
          {orgName && repName && <p style={{ marginTop: 0 }}>{repName}</p>}
          <div className="vads-u-margin-top--3">
            {addressExists(address) && (
              <GoogleMapLink
                address={address}
                recordClick={recordContactLinkClick}
              />
            )}
            {email && (
              <Email email={email} recordClick={recordContactLinkClick} />
            )}
            {contact && (
              <Phone
                contact={contact}
                extension={extension}
                recordClick={recordContactLinkClick}
              />
            )}
          </div>
        </div>
      </div>
    </va-card>
  );
}

ContactCard.propTypes = {
  address: PropTypes.object,
  email: PropTypes.string,
  orgName: PropTypes.string,
  phone: PropTypes.string,
  repName: PropTypes.string,
  type: PropTypes.string,
};

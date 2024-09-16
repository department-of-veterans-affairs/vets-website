import React from 'react';
import PropTypes from 'prop-types';

import Address from './Address';
import { parsePhoneNumber } from '../utilities/helpers';

export default function ContactCard({
  repName,
  orgName,
  address,
  phone,
  email,
}) {
  const { contact, extension } = parsePhoneNumber(phone);

  const addressExists =
    address.address1 && address.city && address.state && address.zip;

  const addressString =
    [address.address1, address.address2, address.address3]
      .filter(Boolean)
      .join(' ') +
    (address.city ? ` ${address.city},` : '') +
    (address.state ? ` ${address.stateCode}` : '') +
    (address.zip ? ` ${address.zip}` : '');

  const recordContactLinkClick = () => {
    // pending analytics event
  };

  return (
    <va-card class="representative-result-card vads-u-padding--4">
      <div className="representative-result-card-content">
        <div className="representative-info-heading">
          {repName && (
            <>
              <h3 className="vads-u-font-family--serif vads-u-margin-top--0p5">
                {repName}
              </h3>
              <p style={{ marginTop: 0 }}>{orgName}</p>
            </>
          )}
        </div>
        <div className="representative-contact-section vads-u-margin-top--3">
          {addressExists && (
            <div className="address-link vads-u-display--flex">
              <va-icon icon="location_on" size="3" />
              <a
                href={`https://maps.google.com?daddr=${addressString}`}
                tabIndex="0"
                className="address-anchor vads-u-margin-left--1"
                onClick={() => recordContactLinkClick()}
                target="_blank"
                rel="noreferrer"
                aria-label={`${address} (opens in a new tab)`}
              >
                <Address address={address} />
              </a>
            </div>
          )}
          {contact && (
            <div className="vads-u-margin-top--1p5 vads-u-display--flex">
              <va-icon icon="phone" size="3" />
              <div className="vads-u-margin-left--1">
                <va-telephone
                  contact={contact}
                  extension={extension}
                  onClick={() => recordContactLinkClick()}
                  disable-analytics
                />
              </div>
            </div>
          )}
          {email && (
            <div className="vads-u-margin-top--1p5 vads-u-display--flex">
              <va-icon icon="mail" size="3" />
              <a
                href={`mailto:${email}`}
                onClick={() => recordContactLinkClick()}
                className="vads-u-margin-left--1"
              >
                {email}
              </a>
            </div>
          )}
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

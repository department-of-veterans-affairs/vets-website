import React from 'react';
import PropTypes from 'prop-types';
import { getPhoneString } from '~/platform/forms-system/src/js/utilities/data/profile';
import { common } from '../props';

export const ConfirmationVeteranContact = ({
  newContactPage,
  veteran,
  hasHomeAndMobilePhone,
}) => {
  const {
    address = {},
    email = '',
    homePhone = {},
    mobilePhone = {},
  } = veteran;

  const emailAddress = newContactPage ? veteran?.email?.emailAddress : email;

  // Only 995 has both home & mobile phone (currently)
  const phone = hasHomeAndMobilePhone ? mobilePhone : veteran.phone;

  return (
    <>
      {hasHomeAndMobilePhone && (
        <li>
          <div className="vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm">
            Home phone number
          </div>
          <div
            className="vads-u-margin-bottom--2 dd-privacy-hidden"
            data-dd-action-name="home phone number"
          >
            <va-telephone
              contact={getPhoneString(homePhone)}
              country-code={
                homePhone?.isInternational ? homePhone?.countryCode : undefined
              }
              extension={homePhone?.extension}
              not-clickable
            />
          </div>
        </li>
      )}
      <li>
        <div className="vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm">
          Mobile phone number
        </div>
        <div
          className="vads-u-margin-bottom--2 dd-privacy-hidden"
          data-dd-action-name="mobile phone number"
        >
          <va-telephone
            contact={getPhoneString(phone)}
            country-code={
              phone?.isInternational ? phone?.countryCode : undefined
            }
            extension={phone?.extension}
            not-clickable
          />
        </div>
      </li>
      <li>
        <div className="vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm">
          Email address
        </div>
        <div
          className="vads-u-margin-bottom--2 dd-privacy-hidden"
          data-testid="veteran-email"
          data-dd-action-name="email address"
        >
          {emailAddress}
        </div>
      </li>
      <li>
        <div className="vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm">
          Mailing address
        </div>
        <div
          className="vads-u-margin-bottom--2 dd-privacy-hidden"
          data-dd-action-name="mailing address"
        >
          <div>{address.addressLine1}</div>
          <div>
            {address.city}, {address.stateCode || address.province || ''}
            {address.addressType === 'INTERNATIONAL'
              ? `, ${address.countryName} `
              : ' '}
            {address.zipCode || address.internationalPostalCode || ''}
          </div>
        </div>
      </li>
    </>
  );
};

ConfirmationVeteranContact.propTypes = {
  hasHomeAndMobilePhone: PropTypes.bool,
  newContactPage: PropTypes.bool,
  veteran: common.veteran,
};

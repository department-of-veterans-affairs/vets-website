import React from 'react';
import PropTypes from 'prop-types';
import { getPhoneString } from '~/platform/forms-system/src/js/utilities/data/profile';

export const ConfirmationVeteranContact = ({
  veteran,
  hasHomeAndMobilePhone,
}) => {
  const {
    address = {},
    email = '',
    homePhone = {},
    mobilePhone = {},
  } = veteran;
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
          data-dd-action-name="email address"
        >
          {email}
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
  veteran: PropTypes.shape({
    vaFileLastFour: PropTypes.string,
    address: PropTypes.shape({
      addressLine1: PropTypes.string,
      addressLine2: PropTypes.string,
      addressLine3: PropTypes.string,
      addressType: PropTypes.string,
      city: PropTypes.string,
      countryName: PropTypes.string,
      internationalPostalCode: PropTypes.string,
      province: PropTypes.string,
      stateCode: PropTypes.string,
      zipCode: PropTypes.string,
    }),
    email: PropTypes.string,
    phone: PropTypes.shape({
      countryCode: PropTypes.string,
      areaCode: PropTypes.string,
      phoneNumber: PropTypes.string,
      phoneNumberExt: PropTypes.string,
    }),
    homePhone: PropTypes.shape({
      countryCode: PropTypes.string,
      areaCode: PropTypes.string,
      phoneNumber: PropTypes.string,
      phoneNumberExt: PropTypes.string,
    }),
    mobilePhone: PropTypes.shape({
      countryCode: PropTypes.string,
      areaCode: PropTypes.string,
      phoneNumber: PropTypes.string,
      phoneNumberExt: PropTypes.string,
    }),
  }),
};

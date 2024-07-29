import React from 'react';
import PropTypes from 'prop-types';

import { getPhoneString } from '~/platform/forms-system/src/js/utilities/data/profile';

import { renderFullName, maskVafn } from '../utils/data';
import { getReadableDate } from '../utils/dates';
import { showValueOrNotSelected } from '../utils/confirmation';

const ConfirmationPersonalInfo = ({
  dob = '',
  homeless,
  userFullName = {},
  veteran = {},
} = {}) => {
  const { address = {}, email = '', phone = {}, vaFileLastFour = '' } = veteran;
  return (
    <>
      <h3 className="vads-u-margin-top--2">Personal information</h3>
      {/* Adding a `role="list"` to `ul` with `list-style: none` to work around
          a problem with Safari not treating the `ul` as a list. */}
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
      <ul className="remove-bullets" role="list">
        <li>
          <div className="page-title vads-u-color--gray">Name</div>
          {renderFullName(userFullName)}
        </li>
        {vaFileLastFour && (
          <li>
            <div className="page-title vads-u-color--gray">VA File Number</div>
            <div
              className="page-value dd-privacy-hidden"
              data-dd-action-name="VA file number"
            >
              {maskVafn(vaFileLastFour || '')}
            </div>
          </li>
        )}
        <li>
          <div className="page-title vads-u-color--gray">Date of birth</div>
          <div
            className="page-value dd-privacy-hidden"
            data-dd-action-name="date of birth"
          >
            {getReadableDate(dob)}
          </div>
        </li>
        <li>
          <div className="page-title vads-u-color--gray">
            Are you experiencing homelessness?
          </div>
          <div
            className="page-value dd-privacy-hidden"
            data-dd-action-name="homeless"
          >
            {showValueOrNotSelected(homeless)}
          </div>
        </li>
        <li>
          <div className="page-title vads-u-color--gray">
            Mobile phone number
          </div>
          <div
            className="page-value dd-privacy-hidden"
            data-dd-action-name="mobile phone number"
          >
            <va-telephone
              contact={getPhoneString(phone)}
              extension={phone?.phoneNumberExt}
              not-clickable
            />
          </div>
        </li>
        <li>
          <div className="page-title vads-u-color--gray">Email address</div>
          <div
            className="page-value dd-privacy-hidden"
            data-dd-action-name="email address"
          >
            {email}
          </div>
        </li>
        <li>
          <div className="page-title vads-u-color--gray">Mailing address</div>
          <div
            className="page-value dd-privacy-hidden"
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
      </ul>
    </>
  );
};

ConfirmationPersonalInfo.propTypes = {
  dob: PropTypes.string,
  homeless: PropTypes.bool,
  userFullName: PropTypes.shape({}),
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
  }),
};

export default ConfirmationPersonalInfo;

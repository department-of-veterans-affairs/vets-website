import React from 'react';
import PropTypes from 'prop-types';

import { getPhoneString } from '~/platform/forms-system/src/js/utilities/data/profile';

import { renderFullName, maskVafn } from '../utils/data';
import { getReadableDate } from '../utils/dates';

const ConfirmationPersonalInfo = ({ profile, data }) => {
  const { userFullName, dob } = profile;
  const { veteran } = data;

  return (
    <>
      <h3 className="vads-u-margin-top--2">Personal Information</h3>
      {/* Adding a `role="list"` to `ul` with `list-style: none` to work around
          a problem with Safari not treating the `ul` as a list. */}
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
      <ul className="remove-bullets" role="list">
        <li>
          <div className="page-title vads-u-color--gray">Name</div>
          <div
            className="page-value dd-privacy-hidden"
            data-dd-action-name="full name"
          >
            {renderFullName(userFullName)}
          </div>
        </li>
        <li>
          <div className="page-title vads-u-color--gray">VA File Number</div>
          <div
            className="page-value dd-privacy-hidden"
            data-dd-action-name="VA file number"
          >
            {maskVafn(veteran.vaFileLastFour || '')}
          </div>
        </li>
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
            {data.homeless ? 'Yes' : 'No'}
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
              contact={getPhoneString(veteran.phone)}
              extension={veteran.phone.phoneNumberExt}
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
            {veteran.email}
          </div>
        </li>
        <li>
          <div className="page-title vads-u-color--gray">Mailing address</div>
          <div
            className="page-value dd-privacy-hidden"
            data-dd-action-name="mailing address"
          >
            <div>{veteran.address?.addressLine1}</div>
            <div>
              {veteran.address?.city}, {veteran.address?.stateCode}{' '}
              {veteran.address?.zipCode}
            </div>
          </div>
        </li>
      </ul>
    </>
  );
};

ConfirmationPersonalInfo.propTypes = {
  data: PropTypes.shape({
    veteran: PropTypes.shape({
      // all DR forms
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
      mobilePhone: PropTypes.shape({
        countryCode: PropTypes.string,
        areaCode: PropTypes.string,
        phoneNumber: PropTypes.string,
        extension: PropTypes.string,
      }),
    }),
    homeless: PropTypes.bool,
  }),
  hasHomelessQuestion: PropTypes.bool,
  hasPrimaryPhoneQuestion: PropTypes.bool,
  profile: PropTypes.shape({
    userFullName: PropTypes.shape({}),
    dob: PropTypes.string,
  }),
};

export default ConfirmationPersonalInfo;

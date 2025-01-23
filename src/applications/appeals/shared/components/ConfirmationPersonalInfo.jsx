import React from 'react';
import PropTypes from 'prop-types';

import { getPhoneString } from '~/platform/forms-system/src/js/utilities/data/profile';

import { renderFullName, maskVafn } from '../utils/data';
import { getReadableDate } from '../utils/dates';
import { showValueOrNotSelected } from '../utils/confirmation';

import { chapterHeaderClass } from './ConfirmationCommon';

const ConfirmationPersonalInfo = ({
  dob = '',
  homeless,
  userFullName = {},
  veteran = {},
  hasHomeAndMobilePhone = false,
  hasLivingSituationChapter = false,
} = {}) => {
  const {
    address = {},
    email = '',
    homePhone = {},
    mobilePhone = {},
    vaFileLastFour = '',
  } = veteran;
  // Only 995 has both home & mobile phone (currently)
  const phone = hasHomeAndMobilePhone ? mobilePhone : veteran.phone;

  return (
    <>
      <h3 className={chapterHeaderClass}>Personal information</h3>
      {/* Adding a `role="list"` to `ul` with `list-style: none` to work around
          a problem with Safari not treating the `ul` as a list. */}
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
      <ul className="remove-bullets" role="list">
        <li>
          <div className="vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm">
            Name
          </div>
          {renderFullName(userFullName)}
        </li>
        {vaFileLastFour && (
          <li>
            <div className="vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm">
              VA File Number
            </div>
            <div
              className="vads-u-margin-bottom--2 dd-privacy-hidden"
              data-dd-action-name="VA file number"
            >
              {maskVafn(vaFileLastFour || '')}
            </div>
          </li>
        )}
        <li>
          <div className="vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm">
            Date of birth
          </div>
          <div
            className="vads-u-margin-bottom--2 dd-privacy-hidden"
            data-dd-action-name="date of birth"
          >
            {getReadableDate(dob)}
          </div>
        </li>
        {!hasLivingSituationChapter && (
          <li>
            <div className="vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm">
              Are you experiencing homelessness?
            </div>
            <div
              className="vads-u-margin-bottom--2 dd-privacy-hidden"
              data-dd-action-name="homeless"
            >
              {showValueOrNotSelected(homeless)}
            </div>
          </li>
        )}
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
      </ul>
    </>
  );
};

ConfirmationPersonalInfo.propTypes = {
  dob: PropTypes.string,
  hasHomeAndMobilePhone: PropTypes.bool,
  hasLivingSituationChapter: PropTypes.bool,
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

import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { reviewEntry } from 'platform/forms-system/src/js/components/ConfirmationView/ChapterSectionCollection';
import { FORMAT_YMD_DATE_FNS, FORMAT_READABLE_DATE_FNS } from '../../constants';
import { parseDateToDateObj } from '../../utils';

const ConfirmationVeteranInformation = ({ formData }) => {
  const { veteran } = formData;
  const { email, fullName, ssn, dateOfBirth } = veteran || {};

  const dobDateObj = parseDateToDateObj(
    dateOfBirth || null,
    FORMAT_YMD_DATE_FNS,
  );

  const {
    mobilePhone: { phoneNumber, countryCode, areaCode, extension },
  } = veteran;
  const formattedPhoneNumber = `${countryCode || ''} ${areaCode ||
    ''} ${phoneNumber || ''}${extension ? ` ext. ${extension}` : ''}`;

  const {
    mailingAddress: {
      addressLine1,
      addressLine2,
      addressLine3,
      city,
      countryName,
      zipCode,
      stateCode,
    },
  } = veteran;

  return (
    <li>
      <h4>Veteran’s personal information</h4>
      <ul
        className="vads-u-padding--0"
        data-testid="vet-personal-info"
        style={{ listStyle: 'none' }}
      >
        {fullName?.first &&
          reviewEntry(
            null,
            `veteran-personal-information-name-first`,
            {},
            'First name',
            fullName?.first,
          )}
        {fullName?.middle &&
          reviewEntry(
            null,
            `veteran-personal-information-name-middle`,
            {},
            'Middle name',
            fullName?.middle,
          )}
        {fullName?.last &&
          reviewEntry(
            null,
            `veteran-personal-information-name-last`,
            {},
            'Last name',
            fullName?.last,
          )}
        {fullName?.suffix &&
          reviewEntry(
            null,
            `veteran-personal-information-name-suffix`,
            {},
            'Suffix',
            fullName?.suffix,
          )}
        {dobDateObj &&
          reviewEntry(
            null,
            `veteran-personal-information-dob`,
            {},
            'Date of birth',
            format(dobDateObj, FORMAT_READABLE_DATE_FNS),
          )}
      </ul>
      <h4>Veteran’s identification information</h4>
      <ul
        className="vads-u-padding--0"
        data-testid="vet-id"
        style={{ listStyle: 'none' }}
      >
        {ssn &&
          reviewEntry(
            null,
            `veteran-personal-information-ssn`,
            {},
            'Social Security number',
            `●●●–●●–${ssn}`,
          )}
      </ul>
      <h4>Veteran’s mailing address</h4>
      <ul
        className="vads-u-padding--0"
        data-testid="vet-mailing"
        style={{ listStyle: 'none' }}
      >
        {countryName &&
          reviewEntry(
            null,
            `veteran-personal-information-country`,
            {},
            'Country',
            countryName,
          )}
        {addressLine1 &&
          reviewEntry(
            null,
            `veteran-personal-information-address-line-1`,
            {},
            'Street address',
            addressLine1,
          )}
        {addressLine2 &&
          reviewEntry(
            null,
            `veteran-personal-information-address-line-2`,
            {},
            'Street address line 2',
            addressLine2,
          )}
        {addressLine3 &&
          reviewEntry(
            null,
            `veteran-personal-information-address-line-3`,
            {},
            'Street address line 3',
            addressLine3,
          )}
        {city &&
          reviewEntry(
            null,
            `veteran-personal-information-city`,
            {},
            'City',
            city,
          )}
        {stateCode &&
          reviewEntry(
            null,
            `veteran-personal-information-state`,
            {},
            'State',
            stateCode,
          )}
        {zipCode &&
          reviewEntry(
            null,
            `veteran-personal-information-zip`,
            {},
            'Postal code',
            zipCode,
          )}
      </ul>
      <h4>Veteran’s contact information</h4>
      <ul
        className="vads-u-padding--0"
        data-testid="vet-contact-list"
        style={{ listStyle: 'none' }}
      >
        {formattedPhoneNumber &&
          reviewEntry(
            null,
            `veteran-personal-information-phone`,
            {},
            'Phone number',
            formattedPhoneNumber,
          )}
        {email &&
          reviewEntry(
            null,
            `veteran-personal-information-email`,
            {},
            'Email address',
            email,
          )}
      </ul>
    </li>
  );
};

ConfirmationVeteranInformation.propTypes = {
  formData: PropTypes.shape({
    veteran: PropTypes.shape({
      email: PropTypes.string,
      fullName: PropTypes.shape({
        first: PropTypes.string,
        middle: PropTypes.string,
        last: PropTypes.string,
        suffix: PropTypes.string,
      }),
      ssn: PropTypes.string,
      dateOfBirth: PropTypes.string,
      mobilePhone: PropTypes.shape({
        phoneNumber: PropTypes.string,
        countryCode: PropTypes.string,
        areaCode: PropTypes.string,
        extension: PropTypes.string,
      }),
      mailingAddress: PropTypes.shape({
        addressLine1: PropTypes.string,
        addressLine2: PropTypes.string,
        addressLine3: PropTypes.string,
        city: PropTypes.string,
        countryName: PropTypes.string,
        zipCode: PropTypes.string,
        stateCode: PropTypes.string,
      }),
    }),
  }).isRequired,
};

export default ConfirmationVeteranInformation;

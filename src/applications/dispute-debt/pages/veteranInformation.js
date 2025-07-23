import React from 'react';
import { reviewEntry } from 'platform/forms-system/src/js/components/ConfirmationView/ChapterSectionCollection';
import VeteranInformation from '../components/VeteranInformation';

const veteranInformation = {
  uiSchema: {
    'ui:description': VeteranInformation,
    'ui:options': {
      hideOnReview: true,
    },
    'ui:confirmationField': ({ formData }) => {
      const { veteran } = formData;
      const { email, fullName, ssn, dateOfBirth } = veteran || {};

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
        <>
          <h4>Veteran’s personal information</h4>
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
          {dateOfBirth &&
            reviewEntry(
              null,
              `veteran-personal-information-dob`,
              {},
              'Date of birth',
              dateOfBirth,
            )}
          <h4>Veteran’s identification information</h4>
          {ssn &&
            reviewEntry(
              null,
              `veteran-personal-information-ssn`,
              {},
              'Social Security number',
              `●●●–●●–${ssn.slice(5)}`,
            )}{' '}
          <h4>Veteran’s mailing address</h4>
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
              `veteran-personal-information-address-line-1`,
              {},
              'Street address line 2',
              addressLine2,
            )}
          {addressLine3 &&
            reviewEntry(
              null,
              `veteran-personal-information-address-line-1`,
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
          <h4>Veteran’s contact information</h4>
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
        </>
      );
    },
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

export default veteranInformation;

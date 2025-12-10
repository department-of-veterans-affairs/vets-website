import React from 'react';
import { VaIcon } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export const getFullName = fullName => {
  if (!fullName) return null;

  const first = (fullName?.first || '').trim();
  const middle = (fullName?.middle || '').trim();
  const last = (fullName?.last || '').trim();

  return [first, middle, last].filter(Boolean).join(' ');
};
export const getCardDescription = item => {
  const poc = item?.pointOfContact;
  const fullName = item?.fullName || poc?.fullName;
  let contactName = '';
  if (fullName && typeof fullName === 'object') {
    contactName = getFullName(fullName);
  } else if (item?.fullName && typeof item.fullName === 'object') {
    contactName = getFullName(item.fullName);
  }

  const email = poc?.email || item?.email;
  const institutionAddress = item?.institutionAddress || {};
  const {
    street,
    street2,
    street3,
    city,
    state,
    postalCode,
    country,
  } = institutionAddress;
  const addressParts = [street, street2, street3].filter(Boolean).map(addr => (
    <span key={addr} className="card-address">
      {addr}
    </span>
  ));
  const cityStateZip =
    city || state || postalCode
      ? `${city || ''}${city && (state || postalCode) ? ',' : ''} ${state ||
          ''} ${postalCode || ''}`.trim()
      : null;

  return item ? (
    <div>
      <>
        {(addressParts.length > 0 || cityStateZip) && (
          <p data-testid="card-address">
            {addressParts}
            {cityStateZip && (
              <span className="card-address">{cityStateZip}</span>
            )}
            {country &&
              country !== 'USA' && (
                <span className="card-address">{country}</span>
              )}
          </p>
        )}
      </>
      <p className="vads-u-margin-bottom--0">
        <strong>Point of contact: </strong>
      </p>
      <p
        className="vads-u-display--flex vads-u-align-items--center vads-u-margin-y--0"
        data-testid="card-name"
      >
        <VaIcon icon="person" className="vads-u-margin-right--0p5" />
        <span className="vads-u-display--inline-block">{contactName}</span>
      </p>
      <p
        className="vads-u-display--flex vads-u-align-items--center vads-u-margin-top--0"
        data-testid="card-email"
      >
        <VaIcon icon="mail" className="vads-u-margin-right--0p5" />
        <span className="vads-u-display--inline-block">{email}</span>
      </p>
    </div>
  ) : null;
};

export const getItemName = item => {
  if (!item) return null;
  return item?.institutionName || 'Location';
};

export const additionalLocationArrayBuilderOptions = {
  arrayPath: 'additionalLocations',
  nounSingular: 'location',
  nounPlural: 'locations',
  required: false,
  text: {
    summaryTitle: 'Review your additional locations',
    summaryTitleWithoutItems: 'You can add more locations to this agreement',
    summaryDescriptionWithoutItems: () => (
      <p className="vads-u-margin-top--4">
        If you have any more campuses or additional locations to add to this
        agreement, you can do so now. You will need a facility code for each
        location you would like to add.
      </p>
    ),
    summaryDescription: null,
    getItemName,
    cardDescription: item => getCardDescription(item),
  },
};

export const dateSigned = () => {
  const date = new Date();
  return date.toISOString().split('T')[0];
};

export const getTransformIntlPhoneNumber = (phone = {}) => {
  let _contact = '';
  const { callingCode, contact, countryCode } = phone;

  if (contact) {
    const _callingCode = callingCode ? `+${callingCode} ` : '';
    const _countryCode = countryCode ? ` (${countryCode})` : '';
    _contact = `${_callingCode}${contact}${_countryCode}`;
  }

  return _contact;
};

export const isPOEEligible = facilityCode => {
  const firstDigit = facilityCode.charAt(0);
  const secondDigit = facilityCode.charAt(1);
  if (['1', '2', '3'].includes(firstDigit)) {
    return ['1', '2', '3', '4', '5'].includes(secondDigit);
  }
  return false;
};

export const facilityCodeUIValidation = (errors, fieldData, formData) => {
  const code = (fieldData || '').trim();

  const currentItem = formData?.additionalLocations?.find(
    item => item?.facilityCode?.trim() === code,
  );

  const additionalFacilityCodes = formData?.additionalLocations?.map(item =>
    item?.facilityCode?.trim(),
  );

  const facilityCodes = [
    ...additionalFacilityCodes,
    formData?.institutionDetails?.facilityCode,
  ];

  const isDuplicate = facilityCodes?.filter(item => item === code).length > 1;

  const badFormat = fieldData && !/^[a-zA-Z0-9]{8}$/.test(fieldData);
  const notFound = currentItem?.institutionName === 'not found';
  const ineligible = currentItem?.poeEligible === false;

  if (!currentItem?.isLoading) {
    if (isDuplicate) {
      errors.addError(
        'You have already added this facility code to this form. Enter a new facility code, or cancel adding this additional location.',
      );
    }
    if (badFormat || notFound) {
      errors.addError(
        'Please enter a valid 8-character facility code. To determine your facility code, refer to your WEAMS 22-1998 Report or contact your ELR.',
      );
    }
    if (ineligible) {
      errors.addError(
        'This institution is unable to participate in the Principles of Excellence.',
      );
    }
  }
};

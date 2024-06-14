import React from 'react';
import countries from './config/countries.json';

export const ADDRESS_TYPES = {
  domestic: 'DOMESTIC',
  international: 'INTERNATIONAL',
  military: 'OVERSEAS MILITARY',
};

export function formatAddress(address) {
  /* eslint-disable prefer-template */
  const {
    country,
    postalCode,
    state,
    street,
    street2,
    addressLine1,
    addressLine2,
    addressLine3,
    addressType,
    city,
    stateCode,
    zipCode,
    militaryAddress,
  } = address || {};

  const { militaryPostOffice, militaryState } = militaryAddress || {};

  let cityStateZip = '';

  const displayCountry = countries.find(
    countryCode =>
      countryCode.countryCodeISO3 === countryCode ||
      countryCode.countryCodeISO3 === country,
  );

  const displayCountryName = displayCountry?.countryName;
  const zip = postalCode || zipCode;

  // Only show country when ADDRESS_TYPES.international
  const addressCountry =
    addressType === ADDRESS_TYPES.international ? displayCountryName : '';

  const addressStreet = street
    ? `${street} ${street2 || ''}`
    : `${addressLine1} ${addressLine2 || ''} ${addressLine3 || ''}`;

  // only use the full state name for military addresses, otherwise just show
  // the two-letter state code
  const stateName = state || stateCode || militaryState;

  switch (addressType) {
    case ADDRESS_TYPES.domestic:
    case ADDRESS_TYPES.military:
      cityStateZip = city || militaryPostOffice;
      if ((city || militaryPostOffice) && (stateCode || militaryState))
        cityStateZip += ', ';
      if (stateCode || militaryState) cityStateZip += stateName;
      if (zipCode) cityStateZip += ' ' + (zipCode || postalCode);
      break;

    default:
      cityStateZip = `${city || militaryPostOffice} ${stateName} ${zip}` || '';
  }

  return { addressStreet, cityStateZip, addressCountry };
}

export function getFileSize(num) {
  if (num > 999999) {
    return `${(num / 1000000).toFixed(1)} MB`;
  }
  if (num > 999) {
    return `${Math.floor(num / 1000)} KB`;
  }
  return `${num} B`;
}

export const setFocus = (selector, tabIndexInclude = true) => {
  const el =
    typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (el) {
    if (tabIndexInclude) el.setAttribute('tabIndex', -1);
    el.focus();
  }
};

export const successIcon = (
  <span
    className="vads-u-color--green vads-u-margin-left--0p5"
    aria-hidden="true"
  >
    <va-icon icon="check_circle" size={3} aria-hidden="true" />
  </span>
);

export const newIcon = (
  <span
    className="vads-u-color--primary vads-u-margin-left--0p5"
    aria-hidden="true"
  >
    <va-icon icon="star" size={3} aria-hidden="true" />
  </span>
);

export const inProgressOrReopenedIcon = (
  <span
    className="vads-u-color--grey vads-u-margin-left--0p5"
    aria-hidden="true"
  >
    <va-icon icon="schedule" size={3} aria-hidden="true" />
  </span>
);

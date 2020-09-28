import React from 'react';
import { countries } from 'vets-json-schema/dist/constants.json';
import titleCase from 'platform/utilities/data/titleCase';

const addBrAfter = line => line && [line, <br key={line} />];
const addBrBefore = line => line && [<br key={line} />, line];

export const formatPhone = (number = '') => {
  let i = 0;
  return number.length === 10
    ? '###-###-####'.replace(/#/g, () => number[i++] || '')
    : number;
};

export const getCountryName = (countryCode = 'USA') =>
  countryCode === 'USA'
    ? ''
    : countries.find(country => country.value === countryCode)?.label || '';

export const contactInfoDescription = ({ formData: { veteran = {} } }) => {
  const {
    phoneNumber,
    emailAddress,
    addressLine1,
    addressLine2,
    addressLine3,
    city,
    stateOrProvinceCode = '',
    zipPostalCode,
    countryCode = 'USA',
  } = veteran;

  let postalString = zipPostalCode || '';
  if (countryCode === 'USA' && zipPostalCode) {
    const lastChunk =
      zipPostalCode.length > 5 ? `-${zipPostalCode.slice(5)}` : '';
    postalString = `${zipPostalCode.slice(0, 5)}${lastChunk}`;
  }

  return (
    <>
      <p>
        This is the contact information we have on file for you. We’ll send any
        important information about your Higher-Level Review to this address.
      </p>
      <p className="vads-u-margin-top--1p5">
        You can update this information on your{' '}
        <a href="/profile" target="_blank" rel="noopener noreferrer">
          profile page
        </a>
        .
      </p>
      <div className="blue-bar-block">
        <h3 className="vads-u-font-size--h4">Phone &amp; email</h3>
        <p>
          <strong>Primary phone</strong>: {formatPhone(phoneNumber)}
        </p>
        <p>
          <strong>Email address</strong>: {emailAddress || ''}
        </p>
        <h3 className="vads-u-font-size--h4">Mailing address</h3>
        <p>
          {addBrAfter(addressLine1)}
          {addBrAfter(addressLine2)}
          {addBrAfter(addressLine3)}
          {city || ''}
          {city && ','} {titleCase(stateOrProvinceCode)} {postalString}
          {addBrBefore(getCountryName(countryCode))}
          &nbsp;
        </p>
      </div>
    </>
  );
};

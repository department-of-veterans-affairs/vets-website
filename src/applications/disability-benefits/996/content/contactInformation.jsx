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
    street,
    street2,
    street3,
    city,
    state = '',
    zipCode5,
    country = 'USA',
  } = veteran;

  let postalString = zipCode5 || '';
  if (country === 'USA' && zipCode5) {
    const lastChunk = zipCode5.length > 5 ? `-${zipCode5.slice(5)}` : '';
    postalString = `${zipCode5.slice(0, 5)}${lastChunk}`;
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
          {addBrAfter(street)}
          {addBrAfter(street2)}
          {addBrAfter(street3)}
          {city || ''}
          {city && ','} {titleCase(state)} {postalString}
          {addBrBefore(getCountryName(country))}
          &nbsp;
        </p>
      </div>
    </>
  );
};

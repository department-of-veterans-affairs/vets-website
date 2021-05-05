import React, { useEffect } from 'react';

import moment from 'moment';

import { genderLabels } from 'platform/static-data/labels';

import AddressView from './AddressView';
import PhoneNumberView from './PhoneNumberView';

const VeteranInformationDisplay = props => {
  const { veteranInfo, data, setFormData } = props;
  const {
    fullName,
    dateOfBirth,
    gender,
    addresses,
    phoneNumbers,
  } = veteranInfo;
  const { residential, mailing } = addresses;

  useEffect(
    () => {
      // only updates teh SIP data if there is no existing vet information.
      if (Object.keys(data.veteranInfo || {}).length === 0) {
        setFormData(veteranInfo);
      }
    },
    [setFormData, veteranInfo, data],
  );

  return (
    <div className="vads-u-border-left--7px vads-u-border-color--primary">
      <div className="vads-u-padding-left--2">
        <p
          className="vads-u-margin--1px vads-u-font-weight--bold"
          aria-label={`Veterans Full Name ${fullName}`}
          data-testid="fullName"
        >
          {fullName}
        </p>
        <p className="vads-u-margin--1px">
          Date of birth:{' '}
          <time
            dateTime={dateOfBirth}
            aria-label={`Veteran's date of birth ${moment(dateOfBirth).format(
              'MMMM DD, YYYY',
            )}`}
            data-testid="dateOfBirth"
          >
            {moment(dateOfBirth).format('MMMM DD, YYYY')}
          </time>
        </p>
        {gender && (
          <>
            <p
              className="vads-u-margin--1px"
              aria-label={`Veteran's Gender ${
                genderLabels[gender] ? genderLabels[gender] : 'UNKNOWN'
              }`}
            >
              Gender:{' '}
              <span data-testid="gender">
                {genderLabels[gender] ? genderLabels[gender] : 'UNKNOWN'}
              </span>
            </p>
          </>
        )}
        {mailing && (
          <>
            <p>
              <span>Mailing address: </span>
              <span data-testid="mailingAddress">
                <AddressView address={mailing} />
              </span>
            </p>
          </>
        )}
        {residential && (
          <>
            <p>
              <span>Home address: </span>
              <span data-testid="residentialAddress">
                <AddressView address={residential} />
              </span>
            </p>
          </>
        )}
        {phoneNumbers.filter(num => num.data).map((number, index) => {
          return <PhoneNumberView key={index} number={number} />;
        })}
      </div>
    </div>
  );
};

export default VeteranInformationDisplay;

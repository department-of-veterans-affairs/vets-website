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

export const transformPhoneNumber = phoneNumber => {
  return phoneNumber.replaceAll('-', '');
};

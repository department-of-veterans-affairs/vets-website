import React from 'react';
import { VaIcon } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export const getFullName = fullName => {
  if (!fullName) return null;

  const first = (fullName?.first || '').trim();
  const middle = (fullName?.middle || '').trim();
  const last = (fullName?.last || '').trim();

  return [first, middle, last].filter(Boolean).join(' ');
};
const getCardDescription = item => {
  const poc = item?.previouslyEnteredPointOfContact;
  const fullName = poc?.fullName || item?.fullName;

  let contactName = '';
  if (typeof fullName === 'string') {
    contactName = fullName;
  } else if (fullName && typeof fullName === 'object') {
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
      ? `${city || ''}${city && (state || postalCode) ? ', ' : ''} ${state ||
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
      <p className="vads-u-display--flex vads-u-align-items--center vads-u-margin-y--0">
        {' '}
        <VaIcon icon="person" className="vads-u-margin-right--0p5" />
        {contactName}
      </p>
      <p className="vads-u-display--flex vads-u-align-items--center vads-u-margin-top--0">
        <VaIcon icon="mail" className="vads-u-margin-right--0p5" /> {email}
      </p>
    </div>
  ) : null;
};

const getItemName = item => {
  if (!item) return null;
  return item?.institutionName || 'Location';
};

export const additionalLocationArrayBuilderOptions = {
  arrayPath: 'additionalLocations',
  nounSingular: 'location',
  nounPlural: 'locations',
  required: false,
  text: {
    getItemName,
    cardDescription: item => getCardDescription(item),
  },
};

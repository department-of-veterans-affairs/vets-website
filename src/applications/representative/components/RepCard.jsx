import React from 'react';
import PropTypes from 'prop-types';

import MapLink from './MapLink';

const RepCard = props => {
  const {
    name,
    type,
    phone,
    address,
    city,
    state,
    postalCode,
  } = props?.selectedRepresentative;
  const cityStateZip = `${city}, ${state} ${postalCode}`;
  const isPOBox =
    address &&
    address
      .replace(/\./g, '')
      .toLowerCase()
      .startsWith('po box');

  return (
    <>
      {name && (
        <>
          <p className="va-address-block vads-u-margin-bottom--4">
            <strong>{name}</strong>, {type}
            <br />
            <va-telephone contact={phone} />
            <br />
            {address && (
              <>
                {address}
                <br />
              </>
            )}
            {cityStateZip}
            <br />
            {!isPOBox && (
              <>
                <MapLink
                  name={name}
                  address={address}
                  city={city}
                  state={state}
                  postalCode={postalCode}
                />

                <br />
              </>
            )}
          </p>
        </>
      )}
    </>
  );
};

RepCard.propTypes = {
  selectedRepresentative: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    phone: PropTypes.string.isRequired,
    address: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    postalCode: PropTypes.string,
  }).isRequired,
};

export default RepCard;

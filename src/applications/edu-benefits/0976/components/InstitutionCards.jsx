import React from 'react';
import FacilityCodeAdditionalInfo from './FacilityCodeAdditionalInfo';

export const EmptyCard = () => {
  return (
    <div>
      <h3 aria-label="Institution not found">--</h3>
      <p>--</p>
    </div>
  );
};

export const DetailsCard = ({ details }) => {
  const {
    street,
    street2,
    street3,
    city,
    state,
    postalCode,
  } = details.mailingAddress;

  return (
    <div>
      <h3 aria-label={details.name}>{details.name}</h3>
      <p className="vads-u-margin-bottom--0">{street}</p>
      {street2 && <p className="vads-u-margin-y--0">{street2}</p>}
      {street3 && <p className="vads-u-margin-y--0">{street3}</p>}
      <p className="vads-u-margin-top--0">
        {city}, {state} {postalCode}
      </p>
      <FacilityCodeAdditionalInfo />
    </div>
  );
};

import React from 'react';
import State from '../../../components/State';
import { lowerCase } from '../../../utils/formatters';

export default function SingleFacilityAvailable({
  facility,
  sortMethod,
  typeOfCareName,
}) {
  return (
    <div className="vads-u-margin-bottom--3">
      <p>
        We found one VA facility for your {lowerCase(typeOfCareName)}{' '}
        appointment.
      </p>
      <strong>{facility.name}</strong>
      <br />
      {facility.address?.city}, <State state={facility.address?.state} />
      <br />
      {!!facility.legacyVAR[sortMethod] && (
        <>
          {facility.legacyVAR[sortMethod]} miles
          <br />
        </>
      )}
    </div>
  );
}

import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import State from '../../../components/State';

export default function VAFacilityInfoMessage({ facility, sortMethod }) {
  return (
    <div className="vads-u-margin-bottom--4">
      <p>
        We found one VA location where you're registered that offer COVID-19
        vaccine appointments.
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
      <AlertBox
        backgroundOnly
        content="If you get a vaccine that requires 2 doses, you'll need to return to the same facility for your second dose."
        headline="Some COVID-19 vaccines require 2 doses"
        status="info"
      />
    </div>
  );
}

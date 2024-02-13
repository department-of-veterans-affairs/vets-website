import React from 'react';
import State from '../../../components/State';
import InfoAlert from '../../../components/InfoAlert';
import getEligibilityMessage from './getEligibilityMessage';

export default function SingleFacilityEligibilityCheckMessage({
  facility,
  eligibility,
  typeOfCare,
}) {
  const title =
    'We found one facility that accepts online scheduling for this care';

  const { content } = getEligibilityMessage({
    eligibility,
    typeOfCare,
    facilityDetails: facility,
  });

  return (
    <div aria-atomic="true" aria-live="assertive">
      <InfoAlert status="warning" headline={title}>
        <p>
          <strong>{facility.name}</strong>
          <br />
          {facility.address?.city}, <State state={facility.address?.state} />
        </p>
        {content}
      </InfoAlert>
    </div>
  );
}

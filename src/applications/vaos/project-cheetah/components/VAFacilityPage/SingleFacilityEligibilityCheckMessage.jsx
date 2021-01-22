import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import ErrorMessage from '../../../components/ErrorMessage';
import { FETCH_STATUS } from '../../../utils/constants';
import State from '../../../components/State';

export default function SingleFacilityEligibilityCheckMessage({
  facility,
  clinicsStatus,
}) {
  if (clinicsStatus === FETCH_STATUS.failed) {
    return <ErrorMessage />;
  }

  const message = <>However, we couldn't find any available slots right now.</>;

  return (
    <div aria-atomic="true" aria-live="assertive">
      <AlertBox status="warning" headline="We found one VA location for you">
        <p>
          <strong>{facility.name}</strong>
          <br />
          {facility.address?.city}, <State state={facility.address?.state} />
        </p>
        {message}
        <p>
          If this location wasn’t what you were looking for, you can{' '}
          <a href="/find-locations" target="_blank" rel="noopener noreferrer">
            search for a nearby location
          </a>{' '}
          and call to schedule an appointment.
        </p>
      </AlertBox>
    </div>
  );
}

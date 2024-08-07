import React, { useCallback } from 'react';
import propTypes from 'prop-types';
import { useTravelPayFlags } from '../../useTravelPayFlags';

export default function TestComponent() {
  const {
    travelPayData,
    travelPayClaimSent,
    setTravelPayClaimSent,
    travelPayEligible,
  } = useTravelPayFlags({
    startTime: '2022-08-12T15:15:00',
  });
  return (
    <div>
      <div data-testid="travelPayQuestion">
        {travelPayData.travelQuestion ? 'yes' : 'no'}
      </div>
      <div data-testid="travelPayAddress">
        {travelPayData.travelAddress ? 'yes' : 'no'}
      </div>
      <div data-testid="travelPayMileage">
        {travelPayData.travelMileage ? 'yes' : 'no'}
      </div>
      <div data-testid="travelPayVehicle">
        {travelPayData.travelVehicle ? 'yes' : 'no'}
      </div>
      <div data-testid="travelPayClaimSent">
        {travelPayClaimSent ? 'yes' : 'no'}
      </div>
      <div data-testid="travelPayEligible">
        {travelPayEligible ? 'yes' : 'no'}
      </div>
      <div data-testid="travelPayData">{travelPayData.appointmentDate}</div>
      <va-button
        uswds
        onClick={useCallback(() => setTravelPayClaimSent(false), [
          setTravelPayClaimSent,
        ])}
        text="setTravelPayClaimSentFalse"
        data-testid="setTravelPayClaimSentFalse"
      />
      <va-button
        uswds
        onClick={useCallback(() => setTravelPayClaimSent(true), [
          setTravelPayClaimSent,
        ])}
        text="setTravelPayClaimSentTrue"
        data-testid="setTravelPayClaimSentTrue"
      />
    </div>
  );
}

TestComponent.propTypes = {
  defaultValue: propTypes.bool,
};

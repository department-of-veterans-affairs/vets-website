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
      <button
        type="button"
        data-testid="setTravelPayClaimSentFalse"
        onClick={useCallback(() => setTravelPayClaimSent(false), [
          setTravelPayClaimSent,
        ])}
      >
        setTravelPayClaimSentFalse
      </button>
      <button
        type="button"
        data-testid="setTravelPayClaimSentTrue"
        onClick={useCallback(() => setTravelPayClaimSent(true), [
          setTravelPayClaimSent,
        ])}
      >
        setTravelPayClaimSentTrue
      </button>
    </div>
  );
}

TestComponent.propTypes = {
  defaultValue: propTypes.bool,
};

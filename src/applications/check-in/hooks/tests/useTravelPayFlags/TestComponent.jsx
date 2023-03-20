import React from 'react';
import propTypes from 'prop-types';
import { useTravelPayFlags } from '../../useTravelPayFlags';

export default function TestComponent() {
  const { travelPayData, travelPayEligible } = useTravelPayFlags({
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

      <div data-testid="travelPayEligible">
        {travelPayEligible ? 'yes' : 'no'}
      </div>
    </div>
  );
}

TestComponent.propTypes = {
  defaultValue: propTypes.bool,
};

import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import React from 'react';

const IneligibleBatteriesAlert = () => (
  <AlertBox
    headline="You're devices aren't eligible for battery resupply"
    content={
      <>
        <p>You can't order batteries for your devices because:</p>{' '}
        <ul>
          <li>They don't require batteries, or</li>
          <li>
            You recently reordered batteries for this device. You can only
            reorder batteries for each device once every 5 months
          </li>
        </ul>
      </>
    }
    status="info"
    isVisible
  />
);

export default IneligibleBatteriesAlert;

/* istanbul ignore file */
import React from 'react';
import { useSendTravelPayClaim } from '../../useSendTravelPayClaim';

export default function TestComponent() {
  useSendTravelPayClaim({
    startTime: '2022-08-12T15:15:00',
  });
  return <p>TestComponent</p>;
}

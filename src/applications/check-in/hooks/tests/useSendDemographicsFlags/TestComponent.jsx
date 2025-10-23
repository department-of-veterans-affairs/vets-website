import React from 'react';
import { useSendDemographicsFlags } from '../../useSendDemographicsFlags';

export default function TestComponent() {
  useSendDemographicsFlags();
  return <p>TestComponent</p>;
}

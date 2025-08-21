/* istanbul ignore file */
import React from 'react';
import { useIsInCCPilot } from '../../../hooks/useIsInCCPilot';

export default function TestComponent() {
  const { isInCCPilot } = useIsInCCPilot();
  return (
    <div>
      <p>Test component</p>
      <p data-testid="pilot-value">{isInCCPilot.toString()}</p>
    </div>
  );
}

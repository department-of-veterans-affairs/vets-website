/* istanbul ignore file */
import React from 'react';
import { useIsInPilotUserStations } from '../../../hooks/useIsInPilotUserStations';

export default function TestComponent() {
  const { isInPilotUserStations } = useIsInPilotUserStations();
  return (
    <div>
      <p>Test component</p>
      <p data-testid="pilot-value">{isInPilotUserStations.toString()}</p>
    </div>
  );
}

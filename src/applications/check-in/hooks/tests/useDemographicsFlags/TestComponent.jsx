import React, { useCallback } from 'react';
import propTypes from 'prop-types';
import { useDemographicsFlags } from '../../useDemographicsFlags';

export default function TestComponent() {
  const {
    demographicsData,
    demographicsFlagsSent,
    setDemographicsFlagsSent,
    demographicsFlagsEmpty,
  } = useDemographicsFlags();
  return (
    <div>
      <div data-testid="demographicsUpToDate">
        {demographicsData.demographicsUpToDate ? 'yes' : 'no'}
      </div>
      <div data-testid="emergencyContactUpToDate">
        {demographicsData.emergencyContactUpToDate ? 'yes' : 'no'}
      </div>
      <div data-testid="nextOfKinUpToDate">
        {demographicsData.nextOfKinUpToDate ? 'yes' : 'no'}
      </div>
      <div data-testid="demographicsFlagsSent">
        {demographicsFlagsSent ? 'yes' : 'no'}
      </div>
      <div data-testid="demographicsFlagsEmpty">
        {demographicsFlagsEmpty ? 'yes' : 'no'}
      </div>
      <button
        type="button"
        data-testid="setDemographicsFlagsSentFalse"
        onClick={useCallback(() => setDemographicsFlagsSent(false), [
          setDemographicsFlagsSent,
        ])}
      >
        setDemographicsFlagsSentFalse
      </button>
      <button
        type="button"
        data-testid="setDemographicsFlagsSentTrue"
        onClick={useCallback(() => setDemographicsFlagsSent(true), [
          setDemographicsFlagsSent,
        ])}
      >
        setDemographicsFlagsSentTrue
      </button>
    </div>
  );
}

TestComponent.propTypes = {
  defaultValue: propTypes.bool,
};

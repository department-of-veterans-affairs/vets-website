import React from 'react';
import propTypes from 'prop-types';
import { useDemographicsFlags } from '../../useDemographicsFlags';

export default function TestComponent() {
  const { demographicsData, demographicsFlagsEmpty } = useDemographicsFlags();
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
      <div data-testid="demographicsFlagsEmpty">
        {demographicsFlagsEmpty ? 'yes' : 'no'}
      </div>
    </div>
  );
}

TestComponent.propTypes = {
  defaultValue: propTypes.bool,
};

import React from 'react';
import PropTypes from 'prop-types';

import ClaimPhaseV2 from './ClaimPhaseV2';
import { getUserPhase } from '../utils/helpers';

export default function ClaimTimelineV2({
  currentPhaseBack,
  id,
  events,
  phase,
}) {
  const userPhase = getUserPhase(phase);
  const activityByPhase = events;

  return (
    <>
      <va-process-list uswds>
        <ClaimPhaseV2
          phase={1}
          current={userPhase}
          activity={activityByPhase}
          id={id}
        />
      </va-process-list>
    </>
  );
}

ClaimTimelineV2.propTypes = {
  id: PropTypes.string.isRequired,
  phase: PropTypes.number.isRequired,
  currentPhaseBack: PropTypes.bool,
  events: PropTypes.object,
  everPhaseBack: PropTypes.bool,
};

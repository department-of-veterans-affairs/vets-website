import React from 'react';
import PropTypes from 'prop-types';

import ClaimPhase from './ClaimPhase';
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
      <va-process-list>
        <li>
          <h3>{userPhase}</h3>
          <p>test</p>
          {/* <ClaimPhase
            phase={1}
            current={userPhase}
            activity={activityByPhase}
            id={id}
          /> */}
          <ClaimPhase
            phase={2}
            current={userPhase}
            activity={activityByPhase}
            id={id}
          >
            <p>
              We assigned your claim to a reviewer. The reviewer will determine
              if we need any more information from you.
            </p>
          </ClaimPhase>
          <ClaimPhase
            phase={3}
            current={userPhase}
            activity={activityByPhase}
            id={id}
          >
            <p>
              If we need more information, we’ll request it from you, health
              care providers, governmental agencies, or others. Once we have all
              the information we need, we’ll review it and send your claim to
              the rating specialist for a decision. There may be times when a
              claim moves forward to “Preparation for notification” and then
              briefly back to this stage for more processing.
            </p>
            {currentPhaseBack &&
              phase === LAST_EVIDENCE_GATHERING_PHASE && <PhaseBackWarning />}
          </ClaimPhase>
          <ClaimPhase
            phase={4}
            current={userPhase}
            activity={activityByPhase}
            id={id}
          >
            <p>We are preparing your claim decision packet to be mailed.</p>
          </ClaimPhase>
          <ClaimPhase
            phase={5}
            current={userPhase}
            activity={activityByPhase}
            id={id}
          >
            {userPhase === 5 && <CompleteDetails />}
          </ClaimPhase>
        </li>
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

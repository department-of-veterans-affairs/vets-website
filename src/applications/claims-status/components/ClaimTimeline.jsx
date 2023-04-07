import React from 'react';
import PropTypes from 'prop-types';

import ClaimPhase from './ClaimPhase';
import PhaseBackWarning from './PhaseBackWarning';
import CompleteDetails from './CompleteDetails';
import { getUserPhase } from '../utils/helpers';

const LAST_EVIDENCE_GATHERING_PHASE = 'PENDING_DECISION_APPROVAL';

export function groupTimelineActivity(events) {
  const phases = {};
  let activity = [];

  const phaseEvents = events
    .map(event => {
      if (event.type.startsWith('phase')) {
        return {
          type: 'phase_entered',
          phase: getPhaseNumber(event.type) + 1,
          date: event.date,
        };
      }

      return event;
    })
    .filter(isEventOrPrimaryPhase);

  phaseEvents.forEach(event => {
    if (event.type.startsWith('phase')) {
      activity.push(event);
      phases[getUserPhase(event.phase)] = activity;
      activity = [];
    } else {
      activity.push(event);
    }
  });

  if (activity.length > 0) {
    phases[1] = activity;
  }

  return phases;
}

export default function ClaimsTimeline(props) {
  const { events, phase, id, currentPhaseBack, everPhaseBack } = props;
  const userPhase = getUserPhase(phase);
  // const activityByPhase = groupTimelineActivity(events);
  const activityByPhase = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
  };

  return (
    <>
      <h3 className="vads-u-visibility--screen-reader">Claim status</h3>
      <ol className="process form-process claim-timeline">
        <ClaimPhase
          phase={1}
          current={userPhase}
          activity={activityByPhase}
          id={id}
        />
        <ClaimPhase
          phase={2}
          current={userPhase}
          activity={activityByPhase}
          id={id}
        >
          <p>
            We assigned your claim to a reviewer. The reviewer will determine if
            we need any more information from you.
          </p>
        </ClaimPhase>
        <ClaimPhase
          phase={3}
          current={userPhase}
          activity={activityByPhase}
          id={id}
        >
          <p>
            If we need more information, we’ll request it from you, health care
            providers, governmental agencies, or others. Once we have all the
            information we need, we’ll review it and send your claim to the
            rating specialist for a decision.
            {everPhaseBack &&
              ' There may be times when a claim moves forward to “Preparation for notification” and then briefly back to this stage for more processing.'}
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
      </ol>
    </>
  );
}

ClaimsTimeline.propTypes = {
  id: PropTypes.string.isRequired,
  phase: PropTypes.number.isRequired,
  currentPhaseBack: PropTypes.bool,
  events: PropTypes.array,
  everPhaseBack: PropTypes.bool,
};

import React from 'react';
import PropTypes from 'prop-types';

import ClaimPhase from './ClaimPhase';
import PhaseBackWarning from './PhaseBackWarning';
import { getUserPhase } from '../utils/helpers';

const LAST_EVIDENCE_GATHERING_PHASE = 6;

export default function ClaimTimeline({ currentPhaseBack, id, events, phase }) {
  const userPhase = getUserPhase(phase);
  const activityByPhase = events;

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
            rating specialist for a decision. There may be times when a claim
            moves forward to “Preparation for notification” and then briefly
            back to this stage for more processing.
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
          {userPhase === 5 && (
            <div>
              <p>
                We mailed you a decision letter. It should arrive within 10 days
                after the date we decided your claim. It can sometimes take
                longer.
              </p>
              <h5 className="vads-u-font-size--h4">Payments</h5>
              <p>
                If you are entitled to back payment (based on an effective
                date), you can expect to receive payment within 1 month of your
                claim’s decision date.
              </p>
            </div>
          )}
        </ClaimPhase>
      </ol>
    </>
  );
}

ClaimTimeline.propTypes = {
  id: PropTypes.string.isRequired,
  phase: PropTypes.number.isRequired,
  currentPhaseBack: PropTypes.bool,
  events: PropTypes.object,
  everPhaseBack: PropTypes.bool,
};

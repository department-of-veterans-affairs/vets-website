import React from 'react';
import PropTypes from 'prop-types';

import ClaimPhase from './ClaimPhase';
import PhaseBackWarning from './PhaseBackWarning';
import { getUserPhase } from '../utils/helpers';

const LAST_EVIDENCE_GATHERING_PHASE = 6;

export default function ClaimTimeline({ currentPhaseBack, phase }) {
  const userPhase = getUserPhase(phase);

  return (
    <>
      <h3 className="vads-u-visibility--screen-reader">Claim status</h3>
      <va-process-list>
        <ClaimPhase phase={1} current={userPhase}>
          <p>We received your claim in our system.</p>
        </ClaimPhase>
        <ClaimPhase phase={2} current={userPhase}>
          <p>
            We’ll check your claim for basic information we need, like your name
            and Social Security number.
          </p>
          <p>If information is missing, we’ll contact you.</p>
        </ClaimPhase>
        <ClaimPhase phase={3} current={userPhase}>
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
        <ClaimPhase phase={4} current={userPhase}>
          <p>We are preparing your claim decision packet to be mailed.</p>
        </ClaimPhase>
        <ClaimPhase phase={5} current={userPhase}>
          <p>
            Your claim has been completed and you will receive a letter
            detailing the outcome of your claim.
          </p>
        </ClaimPhase>
      </va-process-list>
    </>
  );
}

ClaimTimeline.propTypes = {
  phase: PropTypes.number.isRequired,
  currentPhaseBack: PropTypes.bool,
};

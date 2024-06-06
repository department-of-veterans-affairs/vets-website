import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom-v5-compat';
import { buildDateFormatter } from '../../utils/helpers';

export default function ClaimPhaseStepper({
  claimDate,
  currentClaimPhaseDate,
  currentPhase,
}) {
  const formattedClaimDate = buildDateFormatter()(claimDate);
  const formattedCurrentClaimPhaseDate = buildDateFormatter()(
    currentClaimPhaseDate,
  );

  const claimPhases = [
    {
      phase: 1,
      header: 'Step 1: Claim received',
      description: (
        <>
          <p className="vads-u-margin-y--0">
            We started working on your claim on {formattedClaimDate}
          </p>
        </>
      ),
    },
    {
      phase: 2,
      header: 'Step 2: Initial review',
      description: (
        <>
          <p className="vads-u-margin-top--0">
            We’ll check your claim for basic information we need, like your name
            and Social Security number.
          </p>
          <p className="vads-u-margin-bottom--0">
            If information is missing, we’ll contact you.
          </p>
        </>
      ),
    },
    {
      phase: 3,
      header: 'Step 3: Evidence gathering',
      description: (
        <>
          <p>
            We’ll review your claim and make sure we have all the evidence and
            information we need. If we need more evidence to decide your claim,
            we may gather it in these ways:
          </p>
          <ul>
            <li>Ask you to submit evidence </li>
            <li>
              Ask you to have a claim exam{' '}
              <a href="/disability/va-claim-exam/">
                Learn more about VA claim exams
              </a>
            </li>
            <li>
              Request medical records from your private health care provider
            </li>
            <li>Gather evidence from our VA records</li>
          </ul>
          <p>This is usually the longest step in the process.</p>
          <p>
            Note: You can submit evidence at any time. But if you submit
            evidence after this step, your claim will go back to this step for
            review.
          </p>
          <Link
            data-testid="submit-evidence-link"
            aria-label="Submit evidence now"
            title="Submit evidence now"
            to="../files"
          >
            Submit evidence now
          </Link>
        </>
      ),
    },
    {
      phase: 4,
      header: 'Step 4: Evidence review',
      description: (
        <>
          <p>We’ll review all the evidence for your claim.</p>
          <p>
            If we need more evidence or you submit more evidence, your claim
            will go back to Step 3: Evidence gathering.
          </p>
        </>
      ),
    },
    {
      phase: 5,
      header: 'Step 5: Rating',
      description: (
        <>
          <p>We’ll decide your claim and determine your disability rating.</p>
          <p>
            If we need more evidence or you submit more evidence, your claim
            will go back to Step 3: Evidence gathering.
          </p>
        </>
      ),
    },
    {
      phase: 6,
      header: 'Step 6: Preparing decision letter',
      description: (
        <>
          <p>We’ll prepare your decision letter.</p>
          <p>
            If you’re eligible for disability benefits, this letter will include
            your disability rating, the amount of your monthly payments, and the
            date your payments will start.
          </p>
          <p>
            If we need more evidence or you submit more evidence, your claim
            will go back to Step 3: Evidence gathering.
          </p>
        </>
      ),
    },
    {
      phase: 7,
      header: 'Step 7: Final review',
      description: (
        <>
          <p>
            A senior reviewer will do a final review of your claim and the
            decision letter.
          </p>
        </>
      ),
    },
    {
      phase: 8,
      header: 'Step 8: Claim decided',
      description: (
        <>
          <p>
            You’ll be able to view and download your decision letter on the
            status page for this claim.
          </p>
          <Link
            aria-label="Go to the claim letters page"
            title="Go to the claim letters page"
            to="/your-claim-letters"
          >
            Go to the claim letters page
          </Link>
          <p>
            We’ll also send you a copy of your decision letter by mail. It
            should arrive within 10 business days, but it may take longer.
          </p>
        </>
      ),
    },
  ];
  const isCurrentPhase = phase => {
    return phase === currentPhase;
  };

  const phaseCanRepeat = phase => {
    return [3, 4, 5, 6].includes(phase);
  };

  const headerIcon = phase => {
    if (isCurrentPhase(phase) && phase !== 8) {
      return 'flag';
    }

    if (phase < currentPhase || (isCurrentPhase(phase) && phase === 8)) {
      return 'check_circle';
    }

    return '';
  };

  const headerIconText = phase => {
    if (isCurrentPhase(phase) && phase !== 8) {
      return 'Current';
    }

    if (phase < currentPhase || (isCurrentPhase(phase) && phase === 8)) {
      return 'Completed';
    }

    return '';
  };

  const headerIconColor = phase => {
    if (isCurrentPhase(phase) && phase !== 8) {
      return 'phase-current';
    }

    if (phase < currentPhase || (isCurrentPhase(phase) && phase === 8)) {
      return 'phase-complete';
    }

    return '';
  };

  return (
    <div className="claim-phase-stepper">
      <va-accordion>
        {claimPhases.map((claimPhase, phaseIndex) => (
          <va-accordion-item
            key={phaseIndex}
            header={claimPhase.header}
            id={`phase${claimPhase.phase}`}
            open={isCurrentPhase(claimPhase.phase)}
          >
            <va-icon
              icon={headerIcon(claimPhase.phase)}
              class={headerIconColor(claimPhase.phase)}
              srtext={headerIconText(claimPhase.phase)}
              slot="icon"
            />
            {isCurrentPhase(claimPhase.phase) && (
              <strong className="current-phase">
                Your claim is in this step as of{' '}
                {formattedCurrentClaimPhaseDate}.
              </strong>
            )}
            {phaseCanRepeat(claimPhase.phase) && (
              <div className="repeat-phase">
                <va-icon icon="autorenew" size={3} />
                <span>Step may repeat if we need more information</span>
              </div>
            )}
            <span className="vads-u-margin-y--0">{claimPhase.description}</span>
          </va-accordion-item>
        ))}
      </va-accordion>
    </div>
  );
}

ClaimPhaseStepper.propTypes = {
  claimDate: PropTypes.string.isRequired,
  currentClaimPhaseDate: PropTypes.string.isRequired,
  currentPhase: PropTypes.number.isRequired,
};

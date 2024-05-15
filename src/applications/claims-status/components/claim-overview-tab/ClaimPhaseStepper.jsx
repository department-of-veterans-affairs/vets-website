import React from 'react';
import PropTypes from 'prop-types';

import { buildDateFormatter } from '../../utils/helpers';

export default function ClaimPhaseStepper({ currentPhase, claimDate }) {
  const claimPhases = [
    {
      step: 1,
      header: 'Step 1: Claim received',
      description: (
        <>
          <p>We started working on your claim on June 15, 2023</p>
        </>
      ),
    },
    {
      step: 2,
      header: 'Step 2: Initial review',
      description: (
        <>
          <p>
            We’ll check your claim for basic information we need, like your name
            and Social Security number.
          </p>
          <p>
            If basic information is missing, we’ll contact you to gather that
            information.
          </p>
        </>
      ),
    },
    {
      step: 3,
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
              Ask you to have a claim exam Learn more about VA claim exams
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
          <p>Submit evidence now</p>
        </>
      ),
    },
    {
      step: 4,
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
  ];
  const isCurrentPhase = phase => {
    return phase === currentPhase;
  };

  const stepCanRepeat = phase => {
    return [3, 4, 5, 6].includes(phase);
  };

  const headerIcon = phase => {
    if (isCurrentPhase(phase)) {
      return 'flag';
    }

    if (phase < currentPhase) {
      // return 'fa fa-check-circle vads-u-color--green';
      return 'check_circle';
    }

    return '';
  };

  const headerIconColor = phase => {
    if (isCurrentPhase(phase)) {
      return 'phase-current';
      // return 'vads-color-primary';
    }

    if (phase < currentPhase) {
      return 'phase-complete';

      // return 'vads-u-color--green';
    }

    return '';
  };

  const formattedClaimDate = buildDateFormatter()(claimDate);

  return (
    <div className="claim-phase-stepper">
      <va-accordion>
        {claimPhases.map((phase, phaseIndex) => (
          <va-accordion-item
            key={phaseIndex}
            header={phase.header}
            id={`phase + ${phase.step}`}
          >
            <va-icon
              icon={headerIcon(phase.step)}
              class={headerIconColor(phase.step)}
              slot="icon"
            />
            {isCurrentPhase(phase.step) && (
              <strong className="current-phase">
                Your claim is in this step as of {formattedClaimDate}.
              </strong>
            )}
            {stepCanRepeat(phase.step) && (
              <div className="repeat-phase">
                <va-icon icon="autorenew" size={3} />
                <span>Step may repeat if we need more information</span>
              </div>
            )}
            <p>{phase.description}</p>
          </va-accordion-item>
        ))}
      </va-accordion>
    </div>
  );
}

ClaimPhaseStepper.propTypes = {
  claimDate: PropTypes.string.isRequired,
  currentPhase: PropTypes.number.isRequired,
};

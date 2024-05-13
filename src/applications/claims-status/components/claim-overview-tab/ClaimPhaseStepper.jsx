import React from 'react';
import PropTypes from 'prop-types';

export default function ClaimPhaseStepper({ currentPhase }) {
  const headerIcon = phase => {
    if (phase === currentPhase) {
      return 'flag';
    }

    if (phase < currentPhase) {
      // return 'fa fa-check-circle vads-u-color--green';
      return 'check_circle';
    }

    return '';
  };

  const headerIconColor = phase => {
    if (phase === currentPhase) {
      return 'phase-current';
      // return 'vads-color-primary';
    }

    if (phase < currentPhase) {
      return 'phase-complete';

      // return 'vads-u-color--green';
    }

    return '';
  };

  return (
    <div className="claim-phase-stepper">
      <va-accordion>
        <va-accordion-item header="Step 1: Claim received" id="phase1">
          {/* <i className={headerIcon(1)} slot="icon" /> */}
          <va-icon
            icon={headerIcon(1)}
            class={headerIconColor(1)}
            slot="icon"
          />

          <p>We started working on your claim on June 15, 2023</p>
        </va-accordion-item>
        <va-accordion-item header="Step 2: Initial review" id="phase2">
          {/* <i className={headerIcon(2)} slot="icon" /> */}
          <va-icon
            icon={headerIcon(2)}
            class={headerIconColor(2)}
            slot="icon"
          />
          <p>
            We’ll check your claim for basic information we need, like your name
            and Social Security number.
          </p>
          <p>
            If basic information is missing, we’ll contact you to gather that
            information.
          </p>
        </va-accordion-item>
        <va-accordion-item header="Step 3: Evidence gathering" id="phase3">
          {/* <i className={headerIcon(3)} slot="icon" /> */}
          <va-icon
            icon={headerIcon(3)}
            class={headerIconColor(3)}
            slot="icon"
          />
          <strong>Your claim is in this step as of December 28, 2023.</strong>
          <p>
            We'll review your claim and make sure we have all the evidence and
            information we need. If we need more evidence to decide your claim,
            we may gather it in these ways:
          </p>
        </va-accordion-item>
      </va-accordion>
    </div>
  );
}

ClaimPhaseStepper.propTypes = {
  currentPhase: PropTypes.number.isRequired,
};

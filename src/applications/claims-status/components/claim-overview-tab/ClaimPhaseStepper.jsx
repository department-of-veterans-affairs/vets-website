import React from 'react';
import PropTypes from 'prop-types';

import { buildDateFormatter, isPensionClaim } from '../../utils/helpers';
import { getClaimPhases, getPensionClaimPhases } from '../../utils/claimPhase';

export default function ClaimPhaseStepper({
  claimDate,
  currentClaimPhaseDate,
  currentPhase,
  currentPhaseBack,
  claimTypeCode,
}) {
  const formattedClaimDate = buildDateFormatter()(claimDate);
  const formattedCurrentClaimPhaseDate = buildDateFormatter()(
    currentClaimPhaseDate,
  );

  const claimPhases = isPensionClaim(claimTypeCode)
    ? getPensionClaimPhases(formattedClaimDate)
    : getClaimPhases(formattedClaimDate);

  const isCurrentPhase = phase => {
    return phase === currentPhase;
  };
  const isCurrentPhaseAndNotFinalPhase = phase => {
    return isCurrentPhase(phase) && phase !== 8;
  };
  const isPhaseComplete = phase => {
    return phase < currentPhase || (isCurrentPhase(phase) && phase === 8);
  };
  const phaseCanRepeat = phase => {
    return [3, 4, 5, 6].includes(phase);
  };

  let headerIconAttributes = {};
  const showIcon = phase => {
    if (isCurrentPhaseAndNotFinalPhase(phase)) {
      // Set headerIcon object
      headerIconAttributes = {
        icon: 'flag',
        text: 'Current',
        class: 'phase-current',
      };
      return true;
    }

    if (isPhaseComplete(phase)) {
      // Set headerIcon object
      headerIconAttributes = {
        icon: 'check_circle',
        text: 'Completed',
        class: 'phase-complete',
      };
      return true;
    }

    return false;
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
            {showIcon(claimPhase.phase) && (
              <va-icon
                icon={headerIconAttributes.icon}
                class={headerIconAttributes.class}
                srtext={headerIconAttributes.text}
                slot="icon"
              />
            )}
            {isCurrentPhase(claimPhase.phase) && (
              <strong className="current-phase">
                Your claim is in this step as of{' '}
                {formattedCurrentClaimPhaseDate}.
              </strong>
            )}
            {isCurrentPhase(claimPhase.phase) &&
              currentPhaseBack && (
                <va-alert
                  class="optional-alert vads-u-padding-bottom--1"
                  status="info"
                  slim
                >
                  We moved your claim back to this step because we needed to
                  find or review more evidence
                </va-alert>
              )}
            {(!isCurrentPhase(claimPhase.phase) || !currentPhaseBack) &&
              phaseCanRepeat(claimPhase.phase) && (
                <div className="repeat-phase">
                  <va-icon icon="autorenew" size={3} />
                  <span>Step may repeat if we need more information.</span>
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
  claimTypeCode: PropTypes.string,
  currentPhaseBack: PropTypes.bool,
};

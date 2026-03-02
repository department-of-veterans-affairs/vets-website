import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom-v5-compat';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';

import {
  buildDateFormatter,
  getStatusDescription,
  getClaimStatusDescription,
  getClaimPhaseTypeHeaderText,
  getClaimPhaseTypeDescription,
  getShowEightPhases,
} from '../../utils/helpers';

const getPhaseChangeDateText = phaseChangeDate => {
  const formattedDate = buildDateFormatter()(phaseChangeDate);

  return `Moved to this step on ${formattedDate}`;
};

export default function WhatWeAreDoing({
  claimPhaseType,
  claimTypeCode,
  currentPhaseBack,
  phaseChangeDate,
  status,
}) {
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const cstClaimPhasesEnabled = useToggleValue(TOGGLE_NAMES.cstClaimPhases);
  const showEightPhases = getShowEightPhases(
    claimTypeCode,
    cstClaimPhasesEnabled,
  );

  const humanStatus = showEightPhases
    ? getClaimPhaseTypeHeaderText(claimPhaseType)
    : getStatusDescription(status);
  const description = showEightPhases
    ? getClaimPhaseTypeDescription(claimPhaseType)
    : getClaimStatusDescription(status);
  const linkText = showEightPhases
    ? 'Learn more about this step'
    : 'Learn more about the review process';

  return (
    <div className="what-were-doing-container vads-u-margin-bottom--4">
      <h3 className="vads-u-margin-bottom--3">What we’re doing</h3>
      <va-card>
        <h4 className="vads-u-margin-top--0 vads-u-margin-bottom--1">
          {humanStatus}
        </h4>
        <p
          data-cy="description"
          className=" vads-u-margin-top--0p5 vads-u-margin-bottom--0p5"
        >
          {description}
        </p>
        {cstClaimPhasesEnabled && (
          <p data-cy="moved-to-date-text">
            {getPhaseChangeDateText(phaseChangeDate)}
          </p>
        )}
        {currentPhaseBack && (
          <va-alert
            class="optional-alert vads-u-padding-bottom--1"
            status="info"
            slim
          >
            We moved your claim back to this step because we needed to find or
            review more evidence
          </va-alert>
        )}
        <Link
          aria-label={linkText}
          className="vads-u-margin-top--1 active-va-link"
          to="../overview"
        >
          {linkText}
          <va-icon icon="chevron_right" size={3} aria-hidden="true" />
        </Link>
      </va-card>
    </div>
  );
}

WhatWeAreDoing.propTypes = {
  claimPhaseType: PropTypes.string,
  claimTypeCode: PropTypes.string,
  currentPhaseBack: PropTypes.bool,
  phaseChangeDate: PropTypes.string,
  status: PropTypes.string,
};

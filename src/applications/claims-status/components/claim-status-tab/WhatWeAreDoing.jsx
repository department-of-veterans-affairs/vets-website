import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom-v5-compat';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';

import {
  getStatusDescription,
  getClaimStatusDescription,
  getClaimPhaseTypeHeaderText,
  getClaimPhaseTypeDescription,
  buildDateFormatter,
} from '../../utils/helpers';

const getPhaseChangeDateText = phaseChangeDate => {
  const formattedDate = buildDateFormatter()(phaseChangeDate);

  return `Moved to this step on ${formattedDate}`;
};

export default function WhatWeAreDoing({
  claimPhaseType,
  phaseChangeDate,
  status,
}) {
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const cstClaimPhasesEnabled = useToggleValue(TOGGLE_NAMES.cstClaimPhases);
  const humanStatus = cstClaimPhasesEnabled
    ? getClaimPhaseTypeHeaderText(claimPhaseType)
    : getStatusDescription(status);
  const description = cstClaimPhasesEnabled
    ? getClaimPhaseTypeDescription(claimPhaseType)
    : getClaimStatusDescription(status);
  const linkText = cstClaimPhasesEnabled
    ? 'Learn more about this step'
    : 'Overview of the process';

  return (
    <div className="what-were-doing-container vads-u-margin-bottom--4">
      <h3 className="vads-u-margin-bottom--3">What we’re doing</h3>
      <va-card>
        <h4 className="vads-u-margin-top--0 vads-u-margin-bottom--1">
          {humanStatus}
        </h4>
        <p className="vads-u-margin-top--0p5 vads-u-margin-bottom--0p5">
          {description}
        </p>
        {cstClaimPhasesEnabled && (
          <p>{getPhaseChangeDateText(phaseChangeDate)}</p>
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
  phaseChangeDate: PropTypes.string,
  status: PropTypes.string,
};

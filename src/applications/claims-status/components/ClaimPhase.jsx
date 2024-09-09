import React from 'react';
import PropTypes from 'prop-types';
import { getUserPhaseDescription } from '../utils/helpers';

export default function ClaimPhase({ children, current, phase }) {
  const titleText = getUserPhaseDescription(phase);

  return (
    <va-process-list-item
      pending={current < phase}
      checkmark={current > phase}
      active={current === phase}
      header={titleText}
    >
      {children}
    </va-process-list-item>
  );
}

ClaimPhase.propTypes = {
  phase: PropTypes.number.isRequired,
  activity: PropTypes.object,
  children: PropTypes.any,
  current: PropTypes.number,
};

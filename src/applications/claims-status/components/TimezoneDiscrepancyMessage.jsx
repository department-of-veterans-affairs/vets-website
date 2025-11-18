import React from 'react';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import { getTimezoneDiscrepancyMessage } from '../utils/helpers';

export default function TimezoneDiscrepancyMessage() {
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const isEnabled = useToggleValue(
    TOGGLE_NAMES.cstTimezoneDateDiscrepancyMitigation,
  );

  if (!isEnabled) {
    return null;
  }

  const message = getTimezoneDiscrepancyMessage(new Date().getTimezoneOffset());

  if (!message) {
    return null;
  }

  return (
    <p className="vads-u-margin-top--0 vads-u-margin-bottom--3 vads-u-color--gray-medium">
      {message}
    </p>
  );
}

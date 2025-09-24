import React, { useEffect } from 'react';

import PropTypes from 'prop-types';
import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';
import { focusElement } from 'platform/utilities/ui';

import Breadcrumbs from '../components/Breadcrumbs';
import DowntimeWindowAlert from './DownTimeWindowAlert';
import TravelPayStatusContent from '../components/TravelPayStatusContent';

export default function TravelPayStatusApp() {
  useEffect(() => {
    focusElement('h1');
  });

  const {
    useToggleValue,
    useToggleLoadingValue,
    TOGGLE_NAMES,
  } = useFeatureToggle();

  const toggleIsLoading = useToggleLoadingValue();
  const appEnabled = useToggleValue(TOGGLE_NAMES.travelPayPowerSwitch);
  const smocEnabled = useToggleValue(
    TOGGLE_NAMES.travelPaySubmitMileageExpense,
  );

  const title = smocEnabled
    ? 'Travel reimbursement claims'
    : 'Check your travel reimbursement claim status';

  if (toggleIsLoading) {
    return (
      <div className="vads-l-grid-container vads-u-padding-y--3">
        <va-loading-indicator
          label="Loading"
          message="Please wait while we load the application for you."
          data-testid="travel-pay-loading-indicator"
        />
      </div>
    );
  }

  if (!appEnabled) {
    window.location.replace('/');
    return null;
  }

  return (
    <article className="usa-grid-full vads-u-padding-bottom--0">
      <Breadcrumbs />
      <h1 tabIndex="-1" data-testid="header">
        {title}
      </h1>
      <DowntimeWindowAlert appTitle={title}>
        <TravelPayStatusContent />
      </DowntimeWindowAlert>
    </article>
  );
}

TravelPayStatusApp.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

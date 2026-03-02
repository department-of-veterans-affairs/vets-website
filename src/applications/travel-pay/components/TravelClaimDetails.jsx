import React, { useEffect } from 'react';

import { focusElement } from 'platform/utilities/ui';
import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';
import { Element, scrollTo } from 'platform/utilities/scroll';
import { useSelector } from 'react-redux';

import Breadcrumbs from './Breadcrumbs';
import DowntimeWindowAlert from '../containers/DownTimeWindowAlert';
import TravelClaimDetailsContent from './TravelClaimDetailsContent';

export default function TravelClaimDetails() {
  const { isLoading: claimDetailsLoading } = useSelector(
    state => state.travelPay.claimDetails,
  );
  const { isLoading: appointmentLoading } = useSelector(
    state => state.travelPay.appointment,
  );

  useEffect(() => {
    focusElement('h1');
    scrollTo('topScrollElement');
  });

  const {
    useToggleValue,
    useToggleLoadingValue,
    TOGGLE_NAMES,
  } = useFeatureToggle();

  const canViewClaimDetails = useToggleValue(
    TOGGLE_NAMES.travelPayViewClaimDetails,
  );
  const canViewClaimStatuses = useToggleValue(
    TOGGLE_NAMES.travelPayPowerSwitch,
  );

  const featureFlagIsLoading = useToggleLoadingValue();

  if (claimDetailsLoading || appointmentLoading || featureFlagIsLoading) {
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

  // Implicitly assumes that if a user can't view claim statuses,
  // they also can't view claim details
  if (!canViewClaimStatuses) {
    window.location.replace('/');
    return null;
  }

  if (!canViewClaimDetails) {
    window.location.replace('/my-health/travel-pay');
    return null;
  }

  return (
    <Element name="topScrollElement">
      <article className="usa-grid-full vads-u-padding-bottom--0">
        <Breadcrumbs />
        <DowntimeWindowAlert appTitle="Travel Pay">
          <div className="vads-l-col--12 medium-screen:vads-l-col--8">
            <TravelClaimDetailsContent />
          </div>
        </DowntimeWindowAlert>
      </article>
    </Element>
  );
}

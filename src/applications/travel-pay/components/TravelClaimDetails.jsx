import React, { useEffect } from 'react';

import { focusElement } from 'platform/utilities/ui';
import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';
import { Element, scrollTo } from 'platform/utilities/scroll';
import { useDispatch, useSelector } from 'react-redux';

import Breadcrumbs from './Breadcrumbs';
import DowntimeWindowAlert from '../containers/DownTimeWindowAlert';
import TravelClaimDetailsContent from './TravelClaimDetailsContent';
import { useParams } from 'react-router-dom-v5-compat';
import { clearAppointmentData, getAppointmentDataByDateTime, getClaimDetails } from '../redux/actions';

export default function TravelClaimDetails() {
  console.log('TravelClaimDetails | mount');

  const dispatch = useDispatch();

  const { id: claimId } = useParams();

  console.log('TravelClaimDetails | render: claimId: ', claimId);
  
  const {
    isLoading: claimDetailsLoading,
    data: claimDetailsData,
    error: claimDetailsError
  } = useSelector(
    state => state.travelPay.claimDetails,
  );
  const {
    isLoading: appointmentLoading,
    data: appointmentData,
    error: appointmentError
  } = useSelector(
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

  const complexClaimsEnabled = useToggleValue(
    TOGGLE_NAMES.travelPayEnableComplexClaims,
  );

  const canViewClaimDetails = useToggleValue(
    TOGGLE_NAMES.travelPayViewClaimDetails,
  );
  const canViewClaimStatuses = useToggleValue(
    TOGGLE_NAMES.travelPayPowerSwitch,
  );

  const appointmentDateTime = claimDetailsData[claimId]?.appointment?.appointmentDateTime;

  const featureFlagIsLoading = useToggleLoadingValue();

  // Clear appointment data when component mounts
  useEffect(() => {
    dispatch(clearAppointmentData());
  }
  , [dispatch]);
    
  useEffect(
    () => {
      if (claimId && !claimDetailsData[claimId] && !claimDetailsError) {
        console.log('TravelClaimDetails| fetching claim details for id:', claimId);
        dispatch(getClaimDetails(claimId));
      }
    },
    [dispatch, claimDetailsData, claimDetailsError, claimId],
  );
  
  console.log('TravelClaimDetails | appointment dependencies ---');
  console.log('complexClaimsEnabled:', complexClaimsEnabled);
  console.log('appointmentDateTime:', appointmentDateTime);
  console.log('appointmentError:', appointmentError);
  console.log('appointmentData:', appointmentData);
  console.log('---');

  useEffect(
    () => {
      if (
        complexClaimsEnabled &&
        appointmentDateTime &&
        !appointmentError &&
        !appointmentData
      ) {
        console.log('appointmentDateTime:', appointmentDateTime);
        console.log('TravelClaimDetails | fetching appointment data for appointmentDateTime:', appointmentDateTime);
        dispatch(getAppointmentDataByDateTime(appointmentDateTime));
      }
    },
    [
      dispatch,
      complexClaimsEnabled,
      appointmentDateTime,
      appointmentData,
      appointmentError,
      claimId,
    ],
  );

  console.log('TravelClaimDetails | claimDetailsData:', claimDetailsData);
  console.log('TravelClaimDetails | appointmentData:', appointmentData);

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

  console.log('TravelClaimDetails | render');
  return (
    <Element name="topScrollElement">
      <article className="usa-grid-full vads-u-padding-bottom--0">
        <Breadcrumbs />
        <DowntimeWindowAlert appTitle="Travel Pay">
          <div className="vads-l-col--12 medium-screen:vads-l-col--8">
            <TravelClaimDetailsContent
              claimDetails={claimDetailsData[claimId]}
              hasError={claimDetailsError || appointmentError}
            />
          </div>
        </DowntimeWindowAlert>
      </article>
    </Element>
  );
}

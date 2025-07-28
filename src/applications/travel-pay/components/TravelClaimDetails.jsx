import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';
import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';
import { Element, scrollTo } from 'platform/utilities/scroll';

import { HelpTextManage } from './HelpText';
import Breadcrumbs from './Breadcrumbs';
import ClaimDetailsContent from './ClaimDetailsContent';
import { getClaimDetails } from '../redux/actions';
import { REIMBURSEMENT_URL } from '../constants';
import DowntimeWindowAlert from '../containers/DownTimeWindowAlert';

export default function TravelClaimDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { isLoading, data, error } = useSelector(
    state => state.travelPay.claimDetails,
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

  useEffect(
    () => {
      if (id && !data[id] && !error) {
        dispatch(getClaimDetails(id));
      }
    },
    [dispatch, data, error, id],
  );

  if (isLoading || featureFlagIsLoading) {
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
        {error && <h1>There was an error loading the claim details.</h1>}
        <DowntimeWindowAlert appTitle="Travel Pay" />

        {data[id] && <ClaimDetailsContent {...data[id]} />}
        <hr />

        <div className="vads-u-margin-bottom--4">
          <p>
            If you're eligible for reimbursement, we'll deposit your
            reimbursement in your bank account.
          </p>

          <va-link
            href={REIMBURSEMENT_URL}
            text="Learn how to set up direct deposit for travel pay reimbursement"
          />
        </div>
        <va-need-help>
          <div slot="content">
            <HelpTextManage />
          </div>
        </va-need-help>
      </article>
    </Element>
  );
}

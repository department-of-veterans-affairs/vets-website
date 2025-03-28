import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom-v5-compat';

import { scrollTo } from 'platform/utilities/ui/scroll';
import { focusElement } from 'platform/utilities/ui';
import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';
import { Element } from 'platform/utilities/scroll';

import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import { HelpTextManage } from './HelpText';
import Breadcrumbs from './Breadcrumbs';
import ClaimDetailsContent from './ClaimDetailsContent';

export default function TravelClaimDetails() {
  const { id } = useParams();
  const location = useLocation();
  const { claimDetailsProps = null } = location.state ?? {};
  const [claimDetails, setClaimDetails] = useState(claimDetailsProps);
  const [detailsAreLoading, setDetailsAreLoading] = useState(
    !claimDetailsProps,
  );
  const [claimsError, setClaimsError] = useState(null);
  const REIMBURSEMENT_URL =
    'https://va.gov/resources/how-to-set-up-direct-deposit-for-va-travel-pay-reimbursement/';

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
      const fetchClaim = async () => {
        try {
          const claimsUrl = `${environment.API_URL}/travel_pay/v0/claims/${id}`;
          const claimsResponse = await apiRequest(claimsUrl);

          if (claimsResponse.errors) {
            throw new Error(claimsResponse);
          }

          setClaimDetails(claimsResponse);
          setDetailsAreLoading(false);
        } catch (error) {
          setClaimsError(error);
          setDetailsAreLoading(false);
        }
      };

      if (!claimDetails) {
        fetchClaim();
      }
    },
    [claimDetails, id],
  );

  if (detailsAreLoading || featureFlagIsLoading) {
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
        {claimsError && <h1>There was an error loading the claim details.</h1>}
        {claimDetails && <ClaimDetailsContent {...claimDetails} />}
        <hr />

        <p>
          If you're eligible for reimbursement, we'll deposit your reimbursement
          in your bank account.
        </p>

        <a
          href={REIMBURSEMENT_URL}
          className="vads-u-display--inline-block vads-u-margin-bottom--4"
        >
          Learn how to set up direct deposit for travel pay reimbursement
        </a>
        <va-need-help>
          <div slot="content">
            <HelpTextManage />
          </div>
        </va-need-help>
      </article>
    </Element>
  );
}

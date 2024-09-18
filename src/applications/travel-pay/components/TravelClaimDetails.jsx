import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { scrollToTop } from 'platform/utilities/ui/scroll';
import { focusElement } from 'platform/utilities/ui';
import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';

import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import { HelpTextContent } from './HelpText';
import { formatDateTime } from '../util/dates';
import BreadCrumbs from './Breadcrumbs';

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
    scrollToTop();
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
          setClaimDetails(claimsResponse);
          setDetailsAreLoading(false);
        } catch (error) {
          setClaimsError(error);
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

  if (!canViewClaimDetails && !canViewClaimStatuses) {
    window.location.replace('/');
    return null;
  }

  if (!canViewClaimDetails) {
    window.location.replace('/my-health/travel-claim-status');
    return null;
  }

  const {
    createdOn,
    claimStatus,
    claimNumber,
    appointmentDateTime,
    facilityName,
    modifiedOn,
  } = claimDetails || {};

  const [appointmentDate, appointmentTime] = formatDateTime(
    appointmentDateTime,
  );
  const [createDate, createTime] = formatDateTime(createdOn);
  const [updateDate, updateTime] = formatDateTime(modifiedOn);

  return (
    <>
      {/* Q: Is the Mhv nav needed here? */}
      {/* <MhvSecondaryNav /> */}

      <article className="usa-grid-full vads-u-padding-bottom--0">
        {/* <div className="claim-details-breadcrumb-wrapper"> */}
        {/* <va-icon className="back-arrow" icon="arrow_back" /> */}
        <BreadCrumbs />
        {claimDetails && (
          <>
            <h1>Your travel reimbursement claim for {appointmentDate}</h1>
            <h2>Claim number: {claimNumber}</h2>
            <h3>Where</h3>
            <p>
              {appointmentDate} at {appointmentTime} appointment
            </p>
            <p>{facilityName}</p>
            <h3>Claim status: {claimStatus}</h3>
            <p>
              Submitted on {createDate} at {createTime}
            </p>
            <p>
              Updated on on {updateDate} at {updateTime}
            </p>
          </>
        )}

        {claimsError && <h1>There was an error loading the claim details.</h1>}

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
          <div slot="content">{HelpTextContent}</div>
        </va-need-help>
      </article>
    </>
  );
}

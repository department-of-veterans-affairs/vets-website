import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { scrollToTop } from 'platform/utilities/ui/scroll';
import { focusElement } from 'platform/utilities/ui';

import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import { formatDateTime } from '../util/dates';
import BreadCrumbs from './Breadcrumbs';

export default function TravelClaimDetails() {
  const { id } = useParams();
  const location = useLocation();
  const { claimDetailsProps = null } = location.state ?? {};
  const [claimDetails, setClaimDetails] = useState(claimDetailsProps);
  const [isLoading, setIsLoading] = useState(!claimDetailsProps);
  const [claimsError, setClaimsError] = useState(null);
  const BTSSS_PORTAL_URL = 'https://dvagov-btsss.dynamics365portals.us/';

  console.log(claimDetails); // eslint-disable-line no-console
  useEffect(() => {
    // window.scrollTo(0, 0);
    // scrollTo('h1');
    focusElement('h1');
    scrollToTop();
  });
  useEffect(
    () => {
      const fetchClaim = async () => {
        try {
          const claimsUrl = `${environment.API_URL}/travel_pay/v0/claims/${id}`;
          const claimsResponse = await apiRequest(claimsUrl);
          setClaimDetails(claimsResponse);
          setIsLoading(false);
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

  if (isLoading) {
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
          href="https://whereDoesThisGo?.com"
          className="vads-u-display--inline-block vads-u-margin-bottom--4"
        >
          Learn how to set up direct deposit for travel pay reimbursement
        </a>
        <va-need-help>
          <div slot="content">
            <p>
              To manage your travel claims, file a new claim, or learn what your
              claim status means, go to our{' '}
              <a className="btsss-portal-link" href={BTSSS_PORTAL_URL}>
                Beneficiary Travel Self Service System (BTSSS) portal (opens in
                new tab)
              </a>
              .<br />
              Or call <va-telephone contact="8555747292" /> from 7 a.m. to 7
              p.m. Monday through Friday. Have your claim number ready to share
              when you call.
            </p>
          </div>
        </va-need-help>
      </article>
    </>
  );
}

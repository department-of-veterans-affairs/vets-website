import React, { useEffect } from 'react';
import { formatDateParsedZoneLong } from 'platform/utilities/date/index';
import { focusElement } from 'platform/utilities/ui';
import PropTypes from 'prop-types';
import { requestsContainStatus } from '../utilities/poaRequests';

const ClaimantSearchHasPOA = ({ searchData, claimant }) => {
  const lastFour = ssn => {
    return ssn?.substring(5);
  };
  useEffect(() => {
    focusElement('.claimant__results-text');
  }, []);
  const firstPOA = claimant.poaRequests?.[0];

  const statusAlert = claim => {
    if (
      claim.representative &&
      requestsContainStatus('pending', claim.poaRequests)
    ) {
      return (
        <va-alert status="warning" visible>
          <h2>There is a pending representation request</h2>
          <p className="vads-u-margin-y--0">
            To establish representation with this claimant, review and accept
            the pending representation request.
          </p>
          <va-link-action
            href={`/representative/representation-requests/${firstPOA.id}`}
            text="Review the representation request"
            type="primary"
          />
        </va-alert>
      );
    }

    return null;
  };
  return (
    <>
      <hr className="divider claimant-search" aria-hidden="true" />
      <p
        data-testid="representation-requests-table-fetcher-poa-requests"
        className="claimant__results-text"
        role="text"
      >
        Showing result for <strong>"{searchData.first_name}"</strong>
        {', '}
        <strong>"{searchData.last_name}"</strong>
        {', '}
        <strong>"{formatDateParsedZoneLong(searchData.dob)}"</strong>
        {', '}
        <strong>
          "***-**-
          {lastFour(searchData.ssn)}"
        </strong>
      </p>
      {statusAlert(claimant)}
      <h2 className="claimant__name">
        {claimant.lastName}, {claimant.firstName}
      </h2>
      <p className="poa-request__card-field vads-u-margin-bottom--2">
        <span>{claimant.city}</span>
        <span>
          {claimant.city ? ', ' : ''}
          {claimant.state}
        </span>
        <span> {claimant.postalCode}</span>
      </p>
      {claimant.representative ? (
        <p className="vads-u-margin-bottom--2 vads-u-margin-top--2">
          <strong>Representative:</strong> {claimant.representative}
        </p>
      ) : (
        <span>
          <strong>POA Status: </strong>
          <span>
            <va-icon size={3} icon="warning" class="yellow-warning" />
          </span>{' '}
          You do not have POA for this claimant.
        </span>
      )}
      {firstPOA ? (
        <va-link
          href={`/representative/find-claimant/claimant-overview/${
            claimant.id
          }`}
          text="Go to the claimant overview"
          type="primary"
        />
      ) : (
        <va-link-action
          href={`/representative/find-claimant/claimant-overview/${
            claimant.id
          }`}
          text="Go to the claimant overview"
          type="primary"
        />
      )}
    </>
  );
};

export default ClaimantSearchHasPOA;

ClaimantSearchHasPOA.propTypes = {
  claimant: PropTypes.object,
  searchData: PropTypes.object,
};

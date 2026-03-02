import React, { useEffect } from 'react';
import { formatDateParsedZoneLong } from 'platform/utilities/date/index';
import { focusElement } from 'platform/utilities/ui';
import { lastFour } from '../utilities/helpers';

const ClaimantSearchNoPOA = searchData => {
  useEffect(() => {
    focusElement('.claimant__results-text');
  }, []);

  return (
    <>
      <hr className="divider claimant-search" aria-hidden="true" />
      <p
        data-testid="representation-requests-table-fetcher-no-poa-requests"
        className="claimant__results-text"
        role="text"
      >
        No result found for <strong>"{searchData.first_name}"</strong>
        {', '}
        <strong>"{searchData.last_name}"</strong>
        {', '}
        <strong>"{formatDateParsedZoneLong(searchData.dob)}"</strong>
        {', '}
        <strong>
          "***-**-
          {lastFour(searchData.ssn)}"
        </strong>
        . Check the entered information and try the search again.
      </p>
      <va-banner
        data-label="Info banner"
        headline="You don’t represent this claimant"
        type="info"
        class="claimant__banner"
        visible
      >
        <p>
          This claimant may be in our system, but you can’t access their
          information or act on their behalf until you establish representation.
        </p>
        <va-link
          href="/representative/help#establishing-representation"
          text="Learn about establishing representation"
        />
      </va-banner>
      <va-additional-info
        class="claimant__additional-info"
        trigger="The portal doesn't check for limited representation"
      >
        <p>
          Limited representation means that the representation is only for a
          specific claim or claims. Check with the claimant or in VBMS for any
          existing limited representation.
        </p>
      </va-additional-info>
    </>
  );
};

export default ClaimantSearchNoPOA;

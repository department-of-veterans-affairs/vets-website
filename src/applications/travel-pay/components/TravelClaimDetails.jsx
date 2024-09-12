import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import BreadCrumbs from './Breadcrumbs';

export default function TravelClaimDetails() {
  const { id } = useParams();
  const location = useLocation();
  console.log(location); // eslint-disable-line no-console
  const { claimDetailsProps } = location.state || {};
  const [claimDetails, setClaimDetails] = useState(claimDetailsProps);
  const [claimsError, setClaimsError] = useState(null);

  useEffect(
    () => {
      const fetchClaim = async () => {
        try {
          const claimsUrl = `${environment.API_URL}/travel_pay/v0/claims/${id}`;
          const claimsResponse = await apiRequest(claimsUrl);
          setClaimDetails(claimsResponse);
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

  return (
    <>
      {/* Q: Is the Mhv nav needed here? */}
      {/* <MhvSecondaryNav /> */}
      <article className="usa-grid-full vads-u-padding-bottom--0">
        <BreadCrumbs />
        <h1>Travel Claim Details</h1>
        <h2>Claim Id: {id}</h2>
      </article>
      {claimsError && <p>There was an error loading the claim details.</p>}
      <pre>{JSON.stringify(claimDetails, null, 2)}</pre>
    </>
  );
}

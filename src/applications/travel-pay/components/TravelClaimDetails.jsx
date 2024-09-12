import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import BreadCrumbs from './Breadcrumbs';

export default function TravelClaimDetails() {
  const { id } = useParams();
  const location = useLocation();
  console.log(location); // eslint-disable-line no-console
  const { claimProps = {} } = location.state || {};

  return (
    <>
      {/* Q: Is the Mhv nav needed here? */}
      {/* <MhvSecondaryNav /> */}
      <article className="usa-grid-full vads-u-padding-bottom--0">
        <BreadCrumbs />
        <h1>Travel Claim Details</h1>
        <h2>Claim Id: {id}</h2>
      </article>
      <pre>{JSON.stringify(claimProps, null, 2)}</pre>
    </>
  );
}

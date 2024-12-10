import React from 'react';
import { useLoaderData } from 'react-router-dom';

import DigitalSubmissionAlert from '../components/DigitalSubmissionAlert/DigitalSubmissionAlert';
import POARequestsCard from '../components/POARequestsCard/POARequestsCard';

const POARequestsPage = () => {
  const poaRequests = useLoaderData();

  return (
    <>
      <h1 data-testid="poa-requests-heading">Power of attorney requests</h1>
      <DigitalSubmissionAlert />
      <div className="poa-requests-page-table-container">
        <h2 data-testid="poa-requests-table-heading">Requests</h2>
        {poaRequests.length === 0 ? (
          <p data-testid="poa-requests-table-fetcher-no-poa-requests">
            No POA requests found
          </p>
        ) : (
          <POARequestsCard poaRequests={poaRequests} />
        )}
      </div>
    </>
  );
};

export default POARequestsPage;

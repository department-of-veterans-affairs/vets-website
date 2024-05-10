import React from 'react';

import POARequestsTableFetcher from '../components/POARequestsTableFetcher/POARequestsTableFetcher';
import usePOARequests from '../hooks/usePOARequests';
import DigitalSubmissionAlert from '../components/DigitalSubmissionAlert/DigitalSubmissionAlert';

const POARequestsPage = () => {
  return (
    <>
      <h1 data-testid="poa-requests-heading">Power of attorney requests</h1>
      <DigitalSubmissionAlert />
      <div className="poa-requests-page-table-container">
        <h2 data-testid="poa-requests-table-heading">Requests</h2>
        <POARequestsTableFetcher usePOARequests={usePOARequests} />
      </div>
    </>
  );
};

export default POARequestsPage;

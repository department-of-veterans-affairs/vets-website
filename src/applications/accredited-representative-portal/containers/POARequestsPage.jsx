import React from 'react';

import POARequestsTableFetcher from '../components/POARequestsTableFetcher/POARequestsTableFetcher';
import usePOARequests from '../hooks/usePOARequests';

const POARequestsPage = () => {
  return (
    <>
      <h1 data-testid="poa-requests-heading">Power of attorney requests</h1>
      <POARequestsTableFetcher usePOARequests={usePOARequests} />
    </>
  );
};

export default POARequestsPage;

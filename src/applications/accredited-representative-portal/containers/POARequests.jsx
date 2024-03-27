import React from 'react';
import POARequestsTable from '../components/POARequestsTable/POARequestsTable';
import { mockPOARequests } from '../mocks/mockPOARequests';

const POARequests = () => {
  return (
    <>
      <h1 data-testid="poa-requests-heading">Power of attorney requests</h1>
      <POARequestsTable poaRequests={mockPOARequests} />
    </>
  );
};

export default POARequests;

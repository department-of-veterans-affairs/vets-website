import React from 'react';
import PoaRequestsTable from '../components/PoaRequestsTable/PoaRequestsTable';
import { mockPOARequests } from '../mocks/mockPOARequests';

const POARequests = () => {
  return (
    <>
      <h1>Power of attorney requests</h1>
      <PoaRequestsTable poaRequests={mockPOARequests} />
    </>
  );
};

export default POARequests;

import React from 'react';
import { useLoaderData } from 'react-router-dom';
import DigitalSubmissionAlert from '../components/DigitalSubmissionAlert/DigitalSubmissionAlert';
import POARequestsTable from '../components/POARequestsTable/POARequestsTable';

const POARequestsPage = () => {
  const { poaRequests } = useLoaderData();

  return (
    <>
      <h1 data-testid="poa-requests-heading">Power of attorney requests</h1>
      <DigitalSubmissionAlert />
      <div className="poa-requests-page-table-container">
        <h2 data-testid="poa-requests-table-heading">Requests</h2>
        <POARequestsTable poaRequests={poaRequests} />
      </div>
    </>
  );
};

export default POARequestsPage;

import React from 'react';
import { useLoaderData } from 'react-router-dom';

import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import DigitalSubmissionAlert from '../components/DigitalSubmissionAlert/DigitalSubmissionAlert';
import POARequestsCard from '../components/POARequestsCard/POARequestsCard';
import mockPOARequestsResponse from '../mocks/mockPOARequestsResponse.json';

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

export async function poaRequestsLoader() {
  try {
    const response = await apiRequest('/power_of_attorney_requests', {
      apiVersion: 'accredited_representative_portal/v0',
    });
    return response.data;
  } catch (error) {
    // Return mock data if API fails
    // TODO: Remove mock data before pilot and uncomment throw statement
    return mockPOARequestsResponse.data;
    // throw error;
  }
}

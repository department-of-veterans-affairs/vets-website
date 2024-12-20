import React from 'react';
import { useLoaderData, NavLink, Outlet } from 'react-router-dom';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import mockPOARequestsResponse from '../mocks/mockPOARequestsResponse.json';
import DigitalSubmissionAlert from '../components/DigitalSubmissionAlert/DigitalSubmissionAlert';

const POARequestsPage = () => {
  const poaRequests = useLoaderData();

  return (
    <>
      <h1 data-testid="poa-requests-heading">Power of attorney requests</h1>
      <DigitalSubmissionAlert />
      <div className="poa-requests-page-table-container">
        {poaRequests.length === 0 ? (
          <p data-testid="poa-requests-table-fetcher-no-poa-requests">
            No POA requests found
          </p>
        ) : (
          <>
            <div role="tablist" className="poa-request__tabs">
              <NavLink
                to="/poa-requests?status=pending"
                className="poa-request__tab-link"
                role="tab"
                aria-controls="panel-pending"
                id="pending"
              >
                Pending requests
              </NavLink>
              <NavLink
                to="/poa-requests?status=completed"
                className="poa-request__tab-link"
                role="tab"
                aria-controls="panel-completed"
                id="completed"
              >
                Completed requests
              </NavLink>
            </div>
            <Outlet />
          </>
        )}
      </div>
    </>
  );
};

export default POARequestsPage;

export async function poaRequestsLoader({ request }) {
  try {
    const response = await apiRequest('/power_of_attorney_requests', {
      apiVersion: 'accredited_representative_portal/v0',
    });
    return response.data;
  } catch (error) {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    // Return mock data if API fails
    // TODO: Remove mock data before pilot and uncomment throw statement
    const requests = mockPOARequestsResponse?.data?.map(req => req);
    return requests?.filter(x => {
      if (status === 'completed') {
        return x.attributes.status !== 'Pending';
      }
      return x.attributes.status === 'Pending';
    });
    // throw error;
  }
}

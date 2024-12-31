import React from 'react';
import { useLoaderData, useSearchParams, Link } from 'react-router-dom';

import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';

import mockPOARequestsResponse from '../mocks/mockPOARequestsResponse.json';
import POARequestCard from '../components/POARequestsCard/POARequestsCard';
import DigitalSubmissionAlert from '../components/DigitalSubmissionAlert/DigitalSubmissionAlert';

const StatusTabLink = ({ status, currentStatus, children }) => {
  const active = status === currentStatus;
  const classNames = ['poa-request__tab-link'];
  if (active) classNames.push('active');

  return (
    <Link to={`?status=${status}`} className={classNames.join(' ')} role="tab">
      {children}
    </Link>
  );
};

const POARequestSearchPage = () => {
  const poaRequests = useLoaderData();
  const [searchParams] = useSearchParams();
  const currentStatus = searchParams.get('status');

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
              <StatusTabLink status="pending" currentStatus={currentStatus}>
                Pending requests
              </StatusTabLink>
              <StatusTabLink status="completed" currentStatus={currentStatus}>
                Completed requests
              </StatusTabLink>
            </div>

            <POARequestCard />
          </>
        )}
      </div>
    </>
  );
};

export default POARequestSearchPage;

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

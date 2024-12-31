import React from 'react';
import {
  useLoaderData,
  useSearchParams,
  redirect,
  Link,
} from 'react-router-dom';

import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';

import mockPOARequestsResponse from '../mocks/mockPOARequestsResponse.json';
import POARequestCard from '../components/POARequestsCard/POARequestsCard';
import DigitalSubmissionAlert from '../components/DigitalSubmissionAlert/DigitalSubmissionAlert';

const STATUSES = {
  PENDING: 'pending',
  COMPLETED: 'completed',
};

const SearchResults = ({ poaRequests }) => {
  if (poaRequests.length === 0) {
    return (
      <p data-testid="poa-requests-table-fetcher-no-poa-requests">
        No POA requests found
      </p>
    );
  }

  return (
    <ul
      data-testid="poa-requests-card"
      className="poa-request__list"
      sort-column={1}
    >
      {poaRequests.map(({ id, attributes: poaRequest }) => {
        return <POARequestCard poaRequest={poaRequest} key={id} id={id} />;
      })}
    </ul>
  );
};

const StatusTabLink = ({ status, searchStatus, children }) => {
  const active = status === searchStatus;
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
  const searchStatus = useSearchParams()[0].get('status');

  return (
    <>
      <h1 data-testid="poa-requests-heading">Power of attorney requests</h1>
      <DigitalSubmissionAlert />

      <div className="poa-requests-page-table-container">
        <div role="tablist" className="poa-request__tabs">
          <StatusTabLink status={STATUSES.PENDING} searchStatus={searchStatus}>
            Pending requests
          </StatusTabLink>
          <StatusTabLink
            status={STATUSES.COMPLETED}
            searchStatus={searchStatus}
          >
            Completed requests
          </StatusTabLink>
        </div>

        <div
          className={searchStatus}
          id={`panel-${searchStatus}`}
          role="tabpanel"
          aria-labelledby={`${searchStatus}`}
        >
          <h2 data-testid="poa-requests-table-heading">
            {(() => {
              switch (searchStatus) {
                case STATUSES.PENDING:
                  return 'Pending requests';
                case STATUSES.COMPLETED:
                  return 'Completed requests';
                default:
                  throw new Error(`Unexpected status: ${searchStatus}`);
              }
            })()}
          </h2>

          <SearchResults poaRequests={poaRequests} />
        </div>
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
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    if (!Object.values(STATUSES).includes(status)) {
      searchParams.set('status', STATUSES.PENDING);
      throw redirect(`?${searchParams.toString()}`);
    }

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

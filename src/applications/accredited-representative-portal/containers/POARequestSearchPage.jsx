import React from 'react';
import {
  useLoaderData,
  useSearchParams,
  redirect,
  Link,
} from 'react-router-dom';

import api from '../utilities/api';
import POARequestCard from '../components/POARequestCard';

const SEARCH_PARAMS = {
  STATUS: 'status',
};

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
      {poaRequests.map((request, index) => {
        return <POARequestCard poaRequest={request} key={index} />;
      })}
    </ul>
  );
};

const StatusTabLink = ({ tabStatus, searchStatus, children }) => {
  const active = tabStatus === searchStatus;
  const classNames = ['poa-request__tab-link'];
  if (active) classNames.push('active');

  return (
    <Link
      to={`?status=${tabStatus}`}
      className={classNames.join(' ')}
      role="tab"
    >
      {children}
    </Link>
  );
};

const DigitalSubmissionAlert = () => (
  <va-alert data-testid="digital-submission-alert" status="info" visible>
    <h2 data-testid="digital-submission-alert-heading" slot="headline">
      Veterans can now digitally submit form 21-22 from VA.gov
    </h2>
    <p
      data-testid="digital-submission-alert-description"
      className="vads-u-margin-y--0"
    >
      Veterans can now{' '}
      <a href="https://www.va.gov/get-help-from-accredited-representative/find-rep/">
        find a VSO
      </a>{' '}
      and{' '}
      <a href="https://www.va.gov/find-forms/about-form-21-22a/">
        sign and submit
      </a>{' '}
      a digital version of form 21-22. Digital submissions will immediately
      populate in the table below.
    </p>
  </va-alert>
);

const POARequestSearchPage = () => {
  const poaRequests = useLoaderData();
  const searchStatus = useSearchParams()[0].get('status');
  return (
    <>
      <h1 data-testid="poa-requests-heading">Power of attorney requests</h1>
      <DigitalSubmissionAlert />

      <div className="poa-requests-page-table-container">
        <div role="tablist" className="poa-request__tabs">
          <StatusTabLink
            tabStatus={STATUSES.PENDING}
            searchStatus={searchStatus}
          >
            Pending
          </StatusTabLink>
          <StatusTabLink
            tabStatus={STATUSES.COMPLETED}
            searchStatus={searchStatus}
          >
            Completed
          </StatusTabLink>
        </div>

        <div
          className={searchStatus}
          id={`panel-${searchStatus}`}
          role="tabpanel"
          aria-labelledby={`${searchStatus}`}
        >
          <h2
            data-testid="poa-requests-table-heading"
            className="poa-request__search-header"
          >
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

POARequestSearchPage.loader = ({ request }) => {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get(SEARCH_PARAMS.STATUS);

  if (!Object.values(STATUSES).includes(status)) {
    searchParams.set(SEARCH_PARAMS.STATUS, STATUSES.PENDING);
    throw redirect(`?${searchParams}`);
  }

  return api.getPOARequests(
    { status },
    {
      signal: request.signal,
    },
  );
};

export default POARequestSearchPage;

import React from 'react';
import {
  useLoaderData,
  useSearchParams,
  redirect,
  Link,
} from 'react-router-dom';
import api from '../utilities/api';
import POARequestCard from '../components/POARequestCard';
import SortForm from '../components/SortForm';

const SEARCH_PARAMS = {
  STATUS: 'status',
  SORT: 'sort',
};

const SORT_BY = {
  CREATED_ASC: 'created_at_asc',
  CREATED_DESC: 'created_at_desc',
  RESOLVED_ASC: 'resolved_at_asc',
  RESOLVED_DESC: 'resolved_at_desc',
};

const PENDING = {
  ASC_OPTION: 'Expiration date (nearest)',
  DESC_OPTION: 'Expiration date (farthest)',
};

const PROCESSED = {
  ASC_OPTION: 'Processed date (nearest)',
  DESC_OPTION: 'Processed date (farthest)',
};

const STATUSES = {
  PENDING: 'pending',
  PROCESSED: 'processed',
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

const StatusTabLink = ({ tabStatus, searchStatus, tabSort, children }) => {
  const active = tabStatus === searchStatus;
  const classNames = ['poa-request__tab-link'];
  if (active) classNames.push('active');
  return (
    <Link
      to={`?status=${tabStatus}&sort=${tabSort}`}
      className={classNames.join(' ')}
      role="tab"
    >
      {children}
    </Link>
  );
};

const POARequestSearchPage = () => {
  const poaRequests = useLoaderData();
  const searchStatus = useSearchParams()[0].get('status');

  return (
    <section className="poa-request">
      <h1
        data-testid="poa-requests-heading"
        className="poa-request__search-header"
      >
        Power of attorney requests
      </h1>
      <p className="poa-request__copy">
        You can accept or decline power of attorney (POA) requests in the
        Accredited Representative Portal. Requests will expire and be removed
        from the portal after 60 days.
        <br />
        <br />
        <strong>Note:</strong> requests need to be submitted using the digital
        VA Form 21-22 on VA.gov.
      </p>
      <br />
      <Link to="/get-help-from-accredited-representative/appoint-rep/introduction">
        VA Form 21-22 (on VA.gov)
      </Link>
      <div className="poa-requests-page-table-container">
        <div role="tablist" className="poa-request__tabs">
          <StatusTabLink
            tabStatus={STATUSES.PENDING}
            searchStatus={searchStatus}
            tabSort={SORT_BY.CREATED_ASC}
          >
            Pending
          </StatusTabLink>
          <StatusTabLink
            tabStatus={STATUSES.PROCESSED}
            searchStatus={searchStatus}
            tabSort={SORT_BY.RESOLVED_DESC}
          >
            Processed
          </StatusTabLink>
        </div>

        <div
          className={searchStatus}
          id={`panel-${searchStatus}`}
          role="tabpanel"
          aria-labelledby={`${searchStatus}`}
        >
          {(() => {
            switch (searchStatus) {
              case STATUSES.PENDING:
                return (
                  <>
                    <h2
                      data-testid="poa-requests-table-heading"
                      className="poa-request__tab-heading"
                    >
                      Pending POA requests
                    </h2>
                    <SortForm
                      asc={SORT_BY.CREATED_ASC}
                      desc={SORT_BY.CREATED_DESC}
                      ascOption={PENDING.ASC_OPTION}
                      descOption={PENDING.DESC_OPTION}
                    />
                  </>
                );
              case STATUSES.PROCESSED:
                return (
                  <>
                    <h2
                      data-testid="poa-requests-table-heading"
                      className="poa-request__tab-heading"
                    >
                      Processed POA requests
                    </h2>
                    <SortForm
                      asc={SORT_BY.RESOLVED_ASC}
                      desc={SORT_BY.RESOLVED_DESC}
                      ascOption={PROCESSED.ASC_OPTION}
                      descOption={PROCESSED.DESC_OPTION}
                    />
                  </>
                );
              default:
                throw new Error(`Unexpected status: ${searchStatus}`);
            }
          })()}

          <SearchResults poaRequests={poaRequests} />
        </div>
      </div>
    </section>
  );
};

POARequestSearchPage.loader = ({ request }) => {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get(SEARCH_PARAMS.STATUS);
  const sort = searchParams.get(SEARCH_PARAMS.SORT);
  if (
    !Object.values(STATUSES).includes(status) &&
    !Object.values(STATUSES).includes(sort)
  ) {
    searchParams.set(SEARCH_PARAMS.STATUS, STATUSES.PENDING);
    searchParams.set(SEARCH_PARAMS.SORT, SORT_BY.CREATED_ASC);
    throw redirect(`?${searchParams}`);
  }

  return api.getPOARequests(
    { status, sort },
    {
      signal: request.signal,
    },
  );
};

export default POARequestSearchPage;

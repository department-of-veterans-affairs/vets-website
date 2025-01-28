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

const COMPLETED = {
  ASC_OPTION: 'Processed date (nearest)',
  DESC_OPTION: 'Processed date (farthest)',
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
            tabSort={SORT_BY.CREATED_ASC}
          >
            Pending
          </StatusTabLink>
          <StatusTabLink
            tabStatus={STATUSES.COMPLETED}
            searchStatus={searchStatus}
            tabSort={SORT_BY.RESOLVED_DESC}
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
          {(() => {
            switch (searchStatus) {
              case STATUSES.PENDING:
                return (
                  <>
                    <h2 data-testid="poa-requests-table-heading">Pending</h2>
                    <SortForm
                      asc={SORT_BY.CREATED_ASC}
                      desc={SORT_BY.CREATED_DESC}
                      ascOption={PENDING.ASC_OPTION}
                      descOption={PENDING.DESC_OPTION}
                    />
                  </>
                );
              case STATUSES.COMPLETED:
                return (
                  <>
                    <h2 data-testid="poa-requests-table-heading">Completed</h2>
                    <SortForm
                      asc={SORT_BY.RESOLVED_ASC}
                      desc={SORT_BY.RESOLVED_DESC}
                      ascOption={COMPLETED.ASC_OPTION}
                      descOption={COMPLETED.DESC_OPTION}
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
    </>
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

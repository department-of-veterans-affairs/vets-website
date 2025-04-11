import React, { useEffect, useState } from 'react';
import {
  useLoaderData,
  useSearchParams,
  redirect,
  Link,
  useNavigation,
} from 'react-router-dom';
import {
  VaLoadingIndicator,
  VaBreadcrumbs,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import api from '../utilities/api';
import {
  SEARCH_BC_LABEL,
  poaSearchBC,
  SEARCH_PARAMS,
  SORT_BY,
  PENDING,
  PROCESSED,
  STATUSES,
} from '../utilities/poaRequests';
import POARequestCard from '../components/POARequestCard';
import SortForm from '../components/SortForm';
import Pagination from '../components/Pagination';

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
      to={`?status=${tabStatus}&sort=${tabSort}&pageSize=20&pageNumber=1`}
      className={classNames.join(' ')}
      role="tab"
      id={`tab-${tabStatus}`}
      aria-controls={`tabpanel-${tabStatus}`}
      aria-selected={active ? 'true' : 'false'}
    >
      {children}
    </Link>
  );
};

const POARequestSearchPage = title => {
  const [count, setCount] = useState(1);
  useEffect(
    () => {
      document.title = title.title;
    },
    [title],
  );
  const poaRequests = useLoaderData().data;
  const meta = useLoaderData().meta.page;
  const pageSize = 20;
  let initCount = 1;
  let pageSizeCount = pageSize * count;
  const totalCount = meta.total;
  const searchStatus = useSearchParams()[0].get('status');
  const navigation = useNavigation();
  if (pageSizeCount > totalCount) {
    pageSizeCount = pageSize + (totalCount - pageSize);
  }
  if (count > 1) {
    initCount += pageSize;
  }
  const searchMetaText = `Showing ${initCount}-${pageSizeCount} of ${
    meta.total
  } ${searchStatus} requests sorted by “Submitted date (newest)”`;

  return (
    <section className="poa-request">
      <VaBreadcrumbs
        breadcrumbList={poaSearchBC}
        label={SEARCH_BC_LABEL}
        homeVeteransAffairs={false}
      />
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
      </p>
      <p className="poa-request__copy">
        <strong>Note:</strong> POA requests need to be submitted using the
        online{' '}
        <va-link
          href="https://www.va.gov/get-help-from-accredited-representative/appoint-rep/introduction/"
          text="VA Form 21-22 (on VA.gov)"
        />
        .
      </p>

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
        {navigation.state === 'loading' ? (
          <VaLoadingIndicator message="Loading..." />
        ) : (
          <div
            className={searchStatus}
            id={`tabpanel-${searchStatus}`}
            role="tabpanel"
            aria-labelledby={`tab-${searchStatus}`}
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
                      <p>{searchMetaText}</p>
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
            <Pagination setCount={setCount} meta={meta} />
          </div>
        )}
      </div>
    </section>
  );
};

POARequestSearchPage.loader = ({ request }) => {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get(SEARCH_PARAMS.STATUS);
  const sort = searchParams.get(SEARCH_PARAMS.SORT);
  const size = searchParams.get(SEARCH_PARAMS.SIZE);
  const number = searchParams.get(SEARCH_PARAMS.NUMBER);
  if (
    !Object.values(STATUSES).includes(status) &&
    !Object.values(STATUSES).includes(sort)
  ) {
    searchParams.set(SEARCH_PARAMS.STATUS, STATUSES.PENDING);
    searchParams.set(SEARCH_PARAMS.SORT, SORT_BY.CREATED_ASC);
    searchParams.set(SEARCH_PARAMS.SIZE, STATUSES.SIZE);
    searchParams.set(SEARCH_PARAMS.NUMBER, STATUSES.NUMBER);
    throw redirect(`?${searchParams}`);
  }

  return api.getPOARequests(
    { status, sort, size, number },
    {
      signal: request.signal,
    },
  );
};

export default POARequestSearchPage;

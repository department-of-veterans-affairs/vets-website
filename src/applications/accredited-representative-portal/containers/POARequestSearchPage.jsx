import React, { useEffect } from 'react';
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
  STATUSES,
  PENDING_SORT_DEFAULTS,
  PROCESSED_SORT_DEFAULTS,
} from '../utilities/poaRequests';
import { recordDatalayerEvent } from '../utilities/analytics';
import POARequestCard from '../components/POARequestCard';
import SortForm from '../components/SortForm';
import Pagination from '../components/Pagination';
import PaginationMeta from '../components/PaginationMeta';

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
      to={`?status=${tabStatus}&sortBy=${
        tabStatus === 'pending' ? 'created_at' : 'resolved_at'
      }&sortOrder=${tabSort}&pageSize=20&pageNumber=1`}
      className={classNames.join(' ')}
      role="tab"
      id={`tab-${tabStatus}`}
      aria-controls={`tabpanel-${tabStatus}`}
      aria-selected={active ? 'true' : 'false'}
      onClick={recordDatalayerEvent}
      data-eventname="nav-tab-click"
    >
      {children}
    </Link>
  );
};

const POARequestSearchPage = title => {
  useEffect(
    () => {
      document.title = title.title;
    },
    [title],
  );
  const poaRequests = useLoaderData().data;
  const meta = useLoaderData().meta.page;
  const searchStatus = useSearchParams()[0].get('status');
  const navigation = useNavigation();

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
        Representation requests
      </h1>
      <p className="poa-request__copy">
        You can accept or decline representation requests (power of attorney) in
        the Accredited Representative Portal. Requests will expire and be
        removed from the portal after 60 days.
      </p>
      <p className="poa-request__copy vads-u-margin--0">
        <strong>Note:</strong> Claimants need to submit requests using the
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
            tabSort={SORT_BY.DESC}
          >
            Pending
          </StatusTabLink>
          <StatusTabLink
            tabStatus={STATUSES.PROCESSED}
            searchStatus={searchStatus}
            tabSort={SORT_BY.DESC}
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
                        Pending representation requests
                      </h2>
                      <SortForm
                        options={[
                          {
                            sortBy: 'created_at',
                            sortOrder: 'desc',
                            label: 'Submitted date (newest)',
                          },
                          {
                            sortBy: 'created_at',
                            sortOrder: 'asc',
                            label: 'Submitted date (oldest)',
                          },
                        ]}
                        defaults={PENDING_SORT_DEFAULTS}
                      />
                      <PaginationMeta
                        meta={meta}
                        results={poaRequests}
                        resultType="requests"
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
                        Processed representation requests
                      </h2>
                      <SortForm
                        options={[
                          {
                            sortBy: 'resolved_at',
                            sortOrder: 'desc',
                            label: 'Processed date (newest)',
                          },
                          {
                            sortBy: 'resolved_at',
                            sortOrder: 'asc',
                            label: 'Processed date (oldest)',
                          },
                        ]}
                        defaults={PROCESSED_SORT_DEFAULTS}
                      />
                      <PaginationMeta
                        meta={meta}
                        results={poaRequests}
                        resultType="requests"
                      />
                    </>
                  );
                default:
                  throw new Error(`Unexpected status: ${searchStatus}`);
              }
            })()}

            <SearchResults poaRequests={poaRequests} />
            <Pagination meta={meta} />
          </div>
        )}
      </div>
    </section>
  );
};

POARequestSearchPage.loader = ({ request }) => {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get(SEARCH_PARAMS.STATUS);
  const sort = searchParams.get(SEARCH_PARAMS.SORTORDER);
  const sortBy = searchParams.get(SEARCH_PARAMS.SORTBY);
  const size = searchParams.get(SEARCH_PARAMS.SIZE);
  const number = searchParams.get(SEARCH_PARAMS.NUMBER);
  if (
    !Object.values(STATUSES).includes(status) &&
    !Object.values(STATUSES).includes(sort)
  ) {
    searchParams.set(SEARCH_PARAMS.STATUS, STATUSES.PENDING);
    searchParams.set(SEARCH_PARAMS.SORTORDER, SORT_BY.DESC);
    searchParams.set(SEARCH_PARAMS.SORTBY, SORT_BY.CREATED);
    searchParams.set(SEARCH_PARAMS.SIZE, PENDING_SORT_DEFAULTS.SIZE);
    searchParams.set(SEARCH_PARAMS.NUMBER, PENDING_SORT_DEFAULTS.NUMBER);
    throw redirect(`?${searchParams}`);
  }

  return api.getPOARequests(
    { status, sort, size, number, sortBy },
    {
      signal: request.signal,
    },
  );
};

export default POARequestSearchPage;

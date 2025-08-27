import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
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
import SortForm from '../components/SortForm';
import Pagination from '../components/Pagination';
import PaginationMeta from '../components/PaginationMeta';
import POARequestSearchPageResults from '../components/POARequestSearchPageResults';

const StatusTabLink = ({
  tabStatus,
  searchStatus,
  tabSort,
  selectedIndividual,
  children,
}) => {
  const active = tabStatus === searchStatus;
  const classNames = ['poa-request__tab-link'];
  if (active) classNames.push('active');
  return (
    <Link
      to={`?status=${tabStatus}&sortBy=${
        tabStatus === 'pending' ? 'created_at' : 'resolved_at'
      }&sortOrder=${tabSort}&pageSize=20&pageNumber=1&as_selected_individual=${selectedIndividual}`}
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

StatusTabLink.propTypes = {
  children: PropTypes.node,
  searchStatus: PropTypes.string,
  selectedIndividual: PropTypes.string,
  tabSort: PropTypes.string,
  tabStatus: PropTypes.string,
};

const POARequestSearchPage = title => {
  const [searchParams] = useSearchParams();
  useEffect(
    () => {
      document.title = title.title;
    },
    [title],
  );
  const poaRequests = useLoaderData().data;
  const meta = useLoaderData().meta.page;
  const searchStatus = searchParams.get('status');
  const selectedIndividual = searchParams.get('as_selected_individual');
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
        the Accredited Representative Portal. Requests will expire after 60
        days. Expired requests will be removed from the portal.
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
            selectedIndividual={selectedIndividual}
          >
            Pending
          </StatusTabLink>
          <StatusTabLink
            tabStatus={STATUSES.PROCESSED}
            searchStatus={searchStatus}
            tabSort={SORT_BY.DESC}
            selectedIndividual={selectedIndividual}
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
                        defaults={PENDING_SORT_DEFAULTS}
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
                        defaults={PROCESSED_SORT_DEFAULTS}
                      />
                    </>
                  );
                default:
                  throw new Error(`Unexpected status: ${searchStatus}`);
              }
            })()}

            <POARequestSearchPageResults poaRequests={poaRequests} />
            <Pagination meta={meta} defaults={PENDING_SORT_DEFAULTS} />
          </div>
        )}
      </div>
    </section>
  );
};

POARequestSearchPage.propTypes = {
  title: PropTypes.string,
};

POARequestSearchPage.loader = ({ request }) => {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get(SEARCH_PARAMS.STATUS);
  const sort = searchParams.get(SEARCH_PARAMS.SORTORDER);
  const sortBy = searchParams.get(SEARCH_PARAMS.SORTBY);
  const size = searchParams.get(SEARCH_PARAMS.SIZE);
  const number = searchParams.get(SEARCH_PARAMS.NUMBER);
  const selectedIndividual = searchParams.get(
    SEARCH_PARAMS.SELECTED_INDIVIDUAL,
  );
  if (
    !Object.values(STATUSES).includes(status) &&
    !Object.values(STATUSES).includes(sort)
  ) {
    searchParams.set(SEARCH_PARAMS.STATUS, STATUSES.PENDING);
    searchParams.set(SEARCH_PARAMS.SORTORDER, SORT_BY.DESC);
    searchParams.set(SEARCH_PARAMS.SORTBY, SORT_BY.CREATED);
    searchParams.set(SEARCH_PARAMS.SIZE, PENDING_SORT_DEFAULTS.SIZE);
    searchParams.set(
      SEARCH_PARAMS.SELECTED_INDIVIDUAL,
      PENDING_SORT_DEFAULTS.SELECTED_INDIVIDUAL,
    );
    throw redirect(`?${searchParams}`);
  }

  return api.getPOARequests(
    { status, sort, size, number, sortBy, selectedIndividual },
    {
      signal: request.signal,
    },
  );
};

export default POARequestSearchPage;

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
  VaAlert,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from 'platform/utilities/ui';
import api from '../utilities/api';
import { SEARCH_BC_LABEL, poaSearchBC } from '../utilities/poaRequests';
import {
  SEARCH_PARAMS,
  SORT_BY,
  STATUSES,
  PENDING_SORT_DEFAULTS,
  PROCESSED_SORT_DEFAULTS,
} from '../utilities/constants';
import { recordDatalayerEvent } from '../utilities/analytics';
import SortForm from '../components/SortForm';
import Pagination from '../components/Pagination';
import PaginationMeta from '../components/PaginationMeta';
import POARequestSearchPageResults from '../components/POARequestSearchPageResults';

const NoResultsText = searchStatus => (
  <div className="no-poa-requests-text">
    {searchStatus.searchStatus === STATUSES.PENDING
      ? 'No pending representation requests.'
      : 'No processed representation requests.'}
  </div>
);

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
      to={`?status=${tabStatus}&sort=${tabSort}&pageSize=20&pageNumber=1&as_selected_individual=${selectedIndividual}`}
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
  useEffect(() => {
    focusElement('h1');
    document.title = title.title;
  }, [title]);
  const loaderData = useLoaderData() || {};
  const poaRequests = loaderData.data || [];
  const meta =
    loaderData.meta && loaderData.meta.page
      ? loaderData.meta
      : { page: { total: 0, number: 1, totalPages: 1 } };
  const { showPOA403Alert } = loaderData;
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
        data-testid="representation-requests-heading"
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
      {showPOA403Alert && (
        <>
          <br />
          <VaAlert status="info" uswds visible data-testid="poa-403-info-alert">
            <h2 slot="headline">
              You currently can’t receive requests in the portal
            </h2>
            <div className="vads-u-margin-y--0">
              <p className="vads-u-margin-bottom--1">
                <strong>Veteran Service Organization representatives:</strong>{' '}
                None of your organizations have activated the Representation
                Request feature. If you’d like one of your organizations to
                activate this feature, ask the VSO manager or certifying us at{' '}
                <a href="mailto:RepresentativePortalHelp@va.gov">
                  RepresentativePortalHelp@va.gov
                </a>
                .
              </p>
              <p className="vads-u-margin-y--0">
                <strong>Claims agents and attorneys:</strong> This feature is
                not yet available for establishing representation with claims
                agents or attorneys. We are exploring it as a future
                enhancement. Visit our{' '}
                <a href="/representative/get-help" rel="noopener noreferrer">
                  help resources
                </a>{' '}
                to learn more about current and upcoming features.
              </p>
            </div>
          </VaAlert>
        </>
      )}

      <div className="representation-requests-page-table-container">
        <div role="tablist" className="poa-request__tabs">
          <StatusTabLink
            tabStatus={STATUSES.PENDING}
            searchStatus={searchStatus}
            tabSort={SORT_BY.NEWEST}
            selectedIndividual={selectedIndividual}
          >
            Pending
          </StatusTabLink>
          <StatusTabLink
            tabStatus={STATUSES.PROCESSED}
            searchStatus={searchStatus}
            tabSort={SORT_BY.NEWEST}
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
                        data-testid="representation-requests-table-heading"
                        className="poa-request__tab-heading"
                      >
                        Pending representation requests
                      </h2>
                      <SortForm
                        options={[
                          {
                            sort: 'newest',
                            label: 'Submitted date (newest)',
                          },
                          {
                            sort: 'oldest',
                            label: 'Submitted date (oldest)',
                          },
                        ]}
                        defaults={PENDING_SORT_DEFAULTS}
                      />
                      {(meta.page.total > 0 ||
                        (selectedIndividual &&
                          selectedIndividual !== 'false')) && (
                        <PaginationMeta
                          meta={meta}
                          results={poaRequests}
                          resultType="requests"
                          defaults={PENDING_SORT_DEFAULTS}
                        />
                      )}
                    </>
                  );
                case STATUSES.PROCESSED:
                  return (
                    <>
                      <h2
                        data-testid="representation-requests-table-heading"
                        className="poa-request__tab-heading"
                      >
                        Processed representation requests
                      </h2>
                      <SortForm
                        options={[
                          {
                            sort: 'newest',
                            label: 'Processed date (newest)',
                          },
                          {
                            sort: 'oldest',
                            label: 'Processed date (oldest)',
                          },
                        ]}
                        defaults={PROCESSED_SORT_DEFAULTS}
                      />
                      {(meta.page.total > 0 ||
                        (selectedIndividual &&
                          selectedIndividual !== 'false')) && (
                        <PaginationMeta
                          meta={meta}
                          results={poaRequests}
                          resultType="requests"
                          defaults={PROCESSED_SORT_DEFAULTS}
                        />
                      )}
                    </>
                  );
                default:
                  throw new Error(`Unexpected status: ${searchStatus}`);
              }
            })()}

            {meta.page.total === 0 && (
              <NoResultsText searchStatus={searchStatus} />
            )}

            {meta.page.total >= 1 && (
              <>
                <POARequestSearchPageResults poaRequests={poaRequests} />
                <Pagination meta={meta} defaults={PENDING_SORT_DEFAULTS} />
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

POARequestSearchPage.propTypes = {
  title: PropTypes.string,
};

POARequestSearchPage.loader = async ({ request }) => {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get(SEARCH_PARAMS.STATUS);
  const sort = searchParams.get(SEARCH_PARAMS.SORT);
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
    searchParams.set(SEARCH_PARAMS.SORT, SORT_BY.NEWEST);
    searchParams.set(SEARCH_PARAMS.SIZE, PENDING_SORT_DEFAULTS.SIZE);
    searchParams.set(SEARCH_PARAMS.NUMBER, PENDING_SORT_DEFAULTS.NUMBER);
    searchParams.set(
      SEARCH_PARAMS.SELECTED_INDIVIDUAL,
      PENDING_SORT_DEFAULTS.SELECTED_INDIVIDUAL,
    );
    throw redirect(`?${searchParams}`);
  }

  try {
    return await api.getPOARequests(
      { status, sort, size, number, selectedIndividual },
      {
        signal: request.signal,
        skip403Redirect: true,
      },
    );
  } catch (err) {
    if (err instanceof Response && err.status === 403) {
      // Try authorization endpoint to distinguish between:
      // 1. User is authorized as rep but POA feature not enabled (show alert)
      // 2. User is not authorized at all (redirect to dashboard)
      try {
        await api.checkAuthorized({
          signal: request.signal,
          skip403Redirect: true, // FIXED: Add this flag
        });
        // If authorized as a representative, show alert and empty data
        return { data: [], meta: {}, showPOA403Alert: true };
      } catch (authErr) {
        // If not authorized, let the redirect/throw happen as usual
        throw err;
      }
    }
    throw err;
  }
};

export default POARequestSearchPage;

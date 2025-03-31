import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { parseISO, isWithinInterval } from 'date-fns';
import {
  VaBackToTop,
  VaPagination,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
// TODO switch to native Set operations once browser support is more widespread
import { intersection, difference } from 'lodash';

import PropTypes from 'prop-types';
import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';
import { focusElement } from 'platform/utilities/ui';
import { Element } from 'platform/utilities/scroll';
import { scrollTo } from 'platform/utilities/ui/scroll';
import Breadcrumbs from '../components/Breadcrumbs';
import TravelClaimCard from '../components/TravelClaimCard';
import TravelPayClaimFilters from '../components/TravelPayClaimFilters';
import { HelpTextManage } from '../components/HelpText';
import { getTravelClaims } from '../redux/actions';
import { getDateFilters } from '../util/dates';
import ErrorAlert from '../components/alerts/ErrorAlert';
import { BTSSS_PORTAL_URL } from '../constants';

export default function TravelPayStatusApp({ children }) {
  const dispatch = useDispatch();

  const filterInfoRef = useRef();

  useEffect(() => {
    focusElement('h1');
    scrollTo('topScrollElement');
  });

  // TODO: utilize user info for authenticated requests
  // and validating logged in status
  // const user = useSelector(selectUser);

  const { isLoading, data, error } = useSelector(
    state => state.travelPay.travelClaims,
  );

  const [hasFetchedClaims, setHasFetchedClaims] = useState(false);

  const [selectedClaimsOrder, setSelectedClaimsOrder] = useState('mostRecent');
  const [orderClaimsBy, setOrderClaimsBy] = useState('mostRecent');
  const [currentPage, setCurrentPage] = useState(1);

  const [statusesToFilterBy, setStatusesToFilterBy] = useState([]);
  const [checkedStatusFilters, setCheckedStatusFilters] = useState([]);
  const [appliedStatusFilters, setAppliedStatusFilters] = useState([]);

  const [datesToFilterBy, setDatesToFilterBy] = useState([]);
  const [selectedDateFilter, setSelectedDateFilter] = useState('all');
  const [appliedDateFilter, setAppliedDateFilter] = useState('all');

  if (data.length > 0 && statusesToFilterBy.length === 0) {
    // Sets initial status filters after travelClaims load

    const topStatuses = new Set(['On hold', 'Denied', 'In manual review']);
    const availableStatuses = new Set(data.map(c => c.claimStatus));

    const availableTopStatuses = intersection(
      Array.from(topStatuses),
      Array.from(availableStatuses),
    );

    const availableNonTopStatuses = difference(
      Array.from(availableStatuses),
      Array.from(topStatuses),
    ).sort(); // .sort() ensures statuses are alphabetized

    const orderedStatusFilters = availableTopStatuses.concat(
      availableNonTopStatuses,
    );
    setStatusesToFilterBy(orderedStatusFilters);
  }

  const dateFilters = getDateFilters();

  if (data.length > 0 && datesToFilterBy.length === 0) {
    // Sets initial date filters after travelClaims load
    const initialDateFilters = dateFilters.filter(filter =>
      data.some(claim =>
        isWithinInterval(new Date(claim.appointmentDateTime), {
          start: filter.start,
          end: filter.end,
        }),
      ),
    );
    setDatesToFilterBy(initialDateFilters);
  }

  // TODO: Move this logic to the API-side
  const compareClaimsDate = (a, b) => {
    // Date.parse(null) evaluates to NaN, which is falsy. By including
    // the OR condition, any comparison with a null appointmentDateTime
    // will fallback to comparing the createOn value instead.
    return (
      Date.parse(b.appointmentDateTime) - Date.parse(a.appointmentDateTime) ||
      Date.parse(b.createdOn) - Date.parse(a.createdOn)
    );
  };

  switch (orderClaimsBy) {
    case 'mostRecent':
      data.sort((a, b) => compareClaimsDate(a, b));
      break;
    case 'oldest':
      data.sort((a, b) => compareClaimsDate(b, a));
      break;
    default:
      break;
  }

  const resetSearch = () => {
    setAppliedStatusFilters([]);
    setCheckedStatusFilters([]);
    setAppliedDateFilter('all');
    setSelectedDateFilter('all');
    setCurrentPage(1);
    filterInfoRef.current.focus();
  };

  const applyFilters = () => {
    setAppliedStatusFilters(checkedStatusFilters);
    setAppliedDateFilter(selectedDateFilter);
    setCurrentPage(1);
    filterInfoRef.current.focus();
  };

  const onStatusFilterChange = e => {
    const statusName = e.target.name;

    if (e.target.checked) {
      setCheckedStatusFilters([...checkedStatusFilters, statusName]);
    } else {
      setCheckedStatusFilters(
        checkedStatusFilters.filter(
          statusFilter => statusFilter !== statusName,
        ),
      );
    }
  };

  const onDateFilterChange = e => {
    setSelectedDateFilter(e.target.value);
  };

  const onSortClick = () => {
    setOrderClaimsBy(selectedClaimsOrder);
    setCurrentPage(1);
    filterInfoRef.current.focus();
  };

  const {
    useToggleValue,
    useToggleLoadingValue,
    TOGGLE_NAMES,
  } = useFeatureToggle();

  const toggleIsLoading = useToggleLoadingValue();
  const appEnabled = useToggleValue(TOGGLE_NAMES.travelPayPowerSwitch);
  const canViewClaimDetails = useToggleValue(
    TOGGLE_NAMES.travelPayViewClaimDetails,
  );

  useEffect(
    () => {
      if (data.length === 0 && !hasFetchedClaims) {
        dispatch(getTravelClaims());
        setHasFetchedClaims(true);
      }
    },
    [dispatch, data, error, hasFetchedClaims],
  );

  const CLAIMS_PER_PAGE = 10;

  const dateFilter = dateFilters.find(
    filter => filter.label === appliedDateFilter,
  );

  let displayedClaims = data.filter(claim => {
    const statusFilterIncludesClaim =
      appliedStatusFilters.length === 0 ||
      appliedStatusFilters.includes(claim.claimStatus);

    const daterangeIncludesClaim =
      appliedDateFilter === 'all'
        ? true
        : isWithinInterval(parseISO(claim.appointmentDateTime), {
            start: dateFilter.start,
            end: dateFilter.end,
          });

    return statusFilterIncludesClaim && daterangeIncludesClaim;
  });

  const numResults = displayedClaims.length;
  const shouldPaginate = displayedClaims.length > CLAIMS_PER_PAGE;
  const numPages = Math.ceil(displayedClaims.length / CLAIMS_PER_PAGE);

  const pageStart = (currentPage - 1) * CLAIMS_PER_PAGE + 1;
  const pageEnd = Math.min(currentPage * CLAIMS_PER_PAGE, numResults);

  if (shouldPaginate) {
    displayedClaims = displayedClaims.slice(pageStart - 1, pageEnd);
  }

  const resultsText = () => {
    let sortAndFilterText;

    if (orderClaimsBy === 'mostRecent') {
      sortAndFilterText = 'date (most recent)';
    }

    if (orderClaimsBy === 'oldest') {
      sortAndFilterText = 'date (oldest)';
    }

    let appliedFiltersLength = appliedStatusFilters.length;
    if (appliedDateFilter !== 'all') {
      appliedFiltersLength += 1;
    }

    if (appliedFiltersLength > 0) {
      sortAndFilterText += `, with ${appliedFiltersLength} ${
        appliedFiltersLength === 1 ? 'filter' : 'filters'
      } applied`;
    }

    if (numResults === 0 && appliedFiltersLength > 0) {
      // Note that appliedFiltersLength === 1 should never be true here, since
      // 0 claims matching a single filter should mean the filter isn't shown
      return `Showing 0 claims with ${appliedFiltersLength} ${
        appliedFiltersLength === 1 ? 'filter' : 'filters'
      } applied`;
    }

    return numResults === 0
      ? `Showing ${numResults} claims`
      : `Showing ${pageStart} ‒ ${pageEnd} of ${numResults} claims, sorted by ${sortAndFilterText}.`;
  };

  const onPageSelect = useCallback(
    selectedPage => {
      setCurrentPage(selectedPage);
      filterInfoRef.current.focus();
    },
    [setCurrentPage],
  );

  if (toggleIsLoading) {
    return (
      <div className="vads-l-grid-container vads-u-padding-y--3">
        <va-loading-indicator
          label="Loading"
          message="Please wait while we load the application for you."
          data-testid="travel-pay-loading-indicator"
        />
      </div>
    );
  }

  if (!appEnabled) {
    window.location.replace('/');
    return null;
  }

  if (error) {
    return (
      <Element name="topScrollElement">
        <article className="usa-grid-full vads-u-padding-bottom--0">
          <Breadcrumbs />
          <h1 tabIndex="-1" data-testid="header">
            Check your travel reimbursement claim status
          </h1>
          <div className="vads-l-col--12 medium-screen:vads-l-col--8">
            <h2 className="vads-u-font-size--h4 vads-u-margin-bottom--4">
              You can use this tool to check the status of your VA travel
              claims.
            </h2>
            <ErrorAlert errorStatus={error.errors[0].status} />
            <VaBackToTop />
          </div>
        </article>
      </Element>
    );
  }

  return (
    <Element name="topScrollElement">
      <article className="usa-grid-full vads-u-padding-bottom--0">
        <Breadcrumbs />
        <h1 tabIndex="-1" data-testid="header">
          Travel reimbursement claims
        </h1>
        <div className="vads-l-col--12 medium-screen:vads-l-col--8">
          <p className="vads-u-font-family--serif vads-u-font-size--lg">
            File new claims for travel reimbursement and review the status of
            all your travel claims.
          </p>
          <h2 className="vads-u-margin-top--2">
            File a new claim for travel reimbursement online
          </h2>
          <p>
            If you’re claiming mileage only, you can file a travel claim for
            eligible past appointments here on VA.gov.
          </p>
          <va-link-action
            href="/my-health/appointments/past"
            text="Go to your past appointments"
            class="vads-u-margin-y--1"
          />
          <p>
            <strong>
              If you need to submit receipts for other expenses, like tolls,
              meals, or lodging
            </strong>
            , you can file your travel claim through the{' '}
            <va-link
              external
              href={BTSSS_PORTAL_URL}
              text="Beneficiary Travel Self-Service System"
            />
            .
          </p>
          {isLoading && (
            <va-loading-indicator
              label="Loading"
              message="Loading Travel Claims..."
            />
          )}
          {!isLoading &&
            data.length > 0 && (
              <>
                <div className="btsss-claims-sort-and-filter-container">
                  <h2 className="vads-u-margin-top--2">Your travel claims</h2>
                  <p>
                    This list shows all the appointments you've filed a travel
                    claim for.
                  </p>
                  <va-additional-info
                    class="vads-u-margin-y--3"
                    trigger="How to manage your claims or get more information"
                  >
                    <>
                      <HelpTextManage />
                      <va-link
                        data-testid="status-explainer-link"
                        href="/my-health/travel-pay/help"
                        text="What does my claim status mean?"
                      />
                    </>
                  </va-additional-info>
                  <label
                    htmlFor="claimsOrder"
                    className="vads-u-margin-bottom--0 vads-u-margin-top--0"
                  >
                    Show appointments with travel claims in this order
                  </label>
                  <div className="btsss-claims-order-select-container vads-u-margin-bottom--3">
                    <select
                      className="vads-u-margin-bottom--0"
                      hint={null}
                      title="Show appointments with travel claims in this order"
                      name="claimsOrder"
                      id="claimsOrder"
                      value={selectedClaimsOrder}
                      onChange={e => setSelectedClaimsOrder(e.target.value)}
                    >
                      <option value="mostRecent">Most Recent</option>
                      <option value="oldest">Oldest</option>
                    </select>
                    <va-button
                      onClick={() => onSortClick()}
                      data-testid="Sort travel claims"
                      secondary
                      text="Sort"
                      label="Sort"
                    />
                  </div>

                  <TravelPayClaimFilters
                    statusesToFilterBy={statusesToFilterBy}
                    checkedStatusFilters={checkedStatusFilters}
                    onStatusFilterChange={onStatusFilterChange}
                    applyFilters={applyFilters}
                    resetSearch={resetSearch}
                    selectedDateFilter={selectedDateFilter}
                    datesToFilterBy={datesToFilterBy}
                    onDateFilterChange={onDateFilterChange}
                  />
                </div>

                <h2 tabIndex={-1} ref={filterInfoRef} id="pagination-info">
                  {resultsText()}
                </h2>

                <section
                  id="travel-claims-list"
                  className="travel-claim-list-container"
                >
                  {displayedClaims.map(travelClaim => (
                    <TravelClaimCard
                      key={travelClaim.id}
                      {...travelClaim}
                      canViewClaimDetails={canViewClaimDetails}
                    />
                  ))}
                </section>
                {shouldPaginate && (
                  <VaPagination
                    onPageSelect={e => onPageSelect(e.detail.page)}
                    page={currentPage}
                    pages={numPages}
                  />
                )}
              </>
            )}
          {!isLoading &&
            !error &&
            data.length === 0 && <p>No travel claims to show.</p>}
          <VaBackToTop />
        </div>
      </article>

      {children}
    </Element>
  );
}

TravelPayStatusApp.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

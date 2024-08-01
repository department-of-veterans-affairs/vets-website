import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  isProfileLoading,
  isLoggedIn,
} from '@department-of-veterans-affairs/platform-user/selectors';
import { parseISO, isWithinInterval } from 'date-fns';
import { MhvSecondaryNav } from '@department-of-veterans-affairs/mhv/exports';
import {
  VaBackToTop,
  VaPagination,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
// TODO switch to native Set operations once browser support is more widespread
import { intersection, difference } from 'lodash';

import PropTypes from 'prop-types';
import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import BreadCrumbs from '../components/Breadcrumbs';
import TravelClaimCard from '../components/TravelClaimCard';
import TravelPayClaimFilters from '../components/TravelPayClaimFilters';
import HelpText from '../components/HelpText';
import { getTravelClaims } from '../redux/actions';
import { getDateFilters } from '../util/dates';

export default function App({ children }) {
  const dispatch = useDispatch();
  const profileLoading = useSelector(state => isProfileLoading(state));
  const userLoggedIn = useSelector(state => isLoggedIn(state));

  const filterInfoRef = useRef();

  // TODO: utilize user info for authenticated requests
  // and validating logged in status
  // const user = useSelector(selectUser);

  const { isLoading, travelClaims, error } = useSelector(
    state => state.travelPay,
  );

  const [selectedClaimsOrder, setSelectedClaimsOrder] = useState('mostRecent');
  const [orderClaimsBy, setOrderClaimsBy] = useState('mostRecent');
  const [currentPage, setCurrentPage] = useState(1);

  const [statusesToFilterBy, setStatusesToFilterBy] = useState([]);
  const [checkedStatusFilters, setCheckedStatusFilters] = useState([]);
  const [appliedStatusFilters, setAppliedStatusFilters] = useState([]);

  const [datesToFilterBy, setDatesToFilterBy] = useState([]);
  const [selectedDateFilter, setSelectedDateFilter] = useState('all');
  const [appliedDateFilter, setAppliedDateFilter] = useState('all');

  if (travelClaims.length > 0 && statusesToFilterBy.length === 0) {
    // Sets initial status filters after travelClaims load

    const topStatuses = new Set(['On Hold', 'Denied', 'In Manual Review']);
    const availableStatuses = new Set(travelClaims.map(c => c.claimStatus));

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

  if (travelClaims.length > 0 && datesToFilterBy.length === 0) {
    // Sets initial date filters after travelClaims load
    const initialDateFilters = dateFilters.filter(filter =>
      travelClaims.some(claim =>
        isWithinInterval(new Date(claim.appointmentDateTime), {
          start: filter.start,
          end: filter.end,
        }),
      ),
    );
    setDatesToFilterBy(initialDateFilters);
  }

  // TODO: Move this logic to the API-side
  switch (orderClaimsBy) {
    case 'mostRecent':
      travelClaims.sort(
        (a, b) =>
          Date.parse(b.appointmentDateTime) - Date.parse(a.appointmentDateTime),
      );
      break;
    case 'oldest':
      travelClaims.sort(
        (a, b) =>
          Date.parse(a.appointmentDateTime) - Date.parse(b.appointmentDateTime),
      );
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

  const appEnabled = useToggleValue(TOGGLE_NAMES.travelPayPowerSwitch);
  const toggleIsLoading = useToggleLoadingValue();

  useEffect(
    () => {
      if (userLoggedIn) {
        dispatch(getTravelClaims());
      }
    },
    [dispatch, userLoggedIn],
  );

  const CLAIMS_PER_PAGE = 10;

  const dateFilter = dateFilters.find(
    filter => filter.label === appliedDateFilter,
  );

  let displayedClaims = travelClaims.filter(claim => {
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

  const onPageSelect = useCallback(
    selectedPage => {
      setCurrentPage(selectedPage);
      filterInfoRef.current.focus();
    },
    [setCurrentPage],
  );

  if ((profileLoading && !userLoggedIn) || toggleIsLoading) {
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

  return (
    <>
      <MhvSecondaryNav />
      <article className="usa-grid-full vads-u-padding-bottom--0">
        <BreadCrumbs />
        <h1
          className="claims-controller-title"
          tabIndex="-1"
          data-testid="header"
        >
          Check your travel reimbursement claim status
        </h1>
        <div className="vads-l-col--12 medium-screen:vads-l-col--8">
          <HelpText />
          {isLoading && (
            <va-loading-indicator
              label="Loading"
              message="Loading Travel Claims..."
            />
          )}
          {!userLoggedIn && (
            <>
              <p>Log in to view your travel claims</p>
              <va-button
                text="Sign in"
                onClick={() => dispatch(toggleLoginModal(true))}
              />
            </>
          )}
          {error && <p>Error fetching travel claims.</p>}
          {userLoggedIn &&
            !isLoading &&
            travelClaims.length > 0 && (
              <>
                <div className="btsss-claims-sort-and-filter-container">
                  <h2>Your travel claims</h2>
                  <p>
                    This list shows all the appointments you've filed a travel
                    claim for.
                  </p>
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
                  {numResults === 0
                    ? `Showing ${numResults} events`
                    : `Showing ${pageStart} ‒ ${pageEnd} of ${numResults} events`}
                </h2>

                <section
                  id="travel-claims-list"
                  className="travel-claim-list-container"
                >
                  {displayedClaims.map(travelClaim =>
                    TravelClaimCard(travelClaim),
                  )}
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
          {userLoggedIn &&
            !isLoading &&
            !error &&
            travelClaims.length === 0 && <p>No travel claims to show.</p>}
          <VaBackToTop />
        </div>
      </article>

      {children}
    </>
  );
}

App.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

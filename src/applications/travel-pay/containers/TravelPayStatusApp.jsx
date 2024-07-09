import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  isProfileLoading,
  isLoggedIn,
} from '@department-of-veterans-affairs/platform-user/selectors';
import { MhvSecondaryNav } from '@department-of-veterans-affairs/mhv/exports';
import {
  VaBackToTop,
  VaPagination,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import PropTypes from 'prop-types';
import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import BreadCrumbs from '../components/Breadcrumbs';
import TravelClaimCard from '../components/TravelClaimCard';
import TravelPayFilters from '../components/TravelPayFilters';
import HelpText from '../components/HelpText';
import { getTravelClaims } from '../redux/actions';

export default function App({ children }) {
  const dispatch = useDispatch();
  const profileLoading = useSelector(state => isProfileLoading(state));
  const userLoggedIn = useSelector(state => isLoggedIn(state));

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
  const [checkedStatuses, setCheckedStatuses] = useState([]);
  const [appliedStatuses, setAppliedStatuses] = useState([]);

  if (travelClaims.length > 0 && statusesToFilterBy.length === 0) {
    // Sets initial status filters after travelClaims load
    const initialStatusFilters = [
      ...new Set(travelClaims.map(claim => claim.claimStatus)),
    ];
    setStatusesToFilterBy(initialStatusFilters);
    setAppliedStatuses(initialStatusFilters);
    setCheckedStatuses(initialStatusFilters);
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
    setAppliedStatuses(statusesToFilterBy);
    setCheckedStatuses(statusesToFilterBy);
  };

  const applyFilters = () => {
    setAppliedStatuses(checkedStatuses);
  };

  const onStatusFilterChange = (e, statusName) => {
    if (e.currentTarget.checked) {
      setCheckedStatuses([...checkedStatuses, statusName]);
    } else {
      setCheckedStatuses(
        checkedStatuses.filter(statusFilter => statusFilter !== statusName),
      );
    }
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

  let displayedClaims = travelClaims.filter(claim =>
    appliedStatuses.includes(claim.claimStatus),
  );
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
    <div>
      <MhvSecondaryNav />
      <article className="usa-grid-full vads-u-padding-bottom--0">
        <BreadCrumbs />
        <h1 tabIndex="-1" data-testid="header">
          Check your travel reimbursement claim status
        </h1>
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
              <div className="btsss-claims-order-container">
                <label
                  htmlFor="claimsOrder"
                  className="vads-u-margin-bottom--0"
                >
                  Show appointments in this order
                </label>
                <div className="btsss-claims-order-select-container vads-u-margin-bottom--3">
                  <select
                    className="vads-u-margin-bottom--0"
                    hint={null}
                    title="Show appointments in this order"
                    name="claimsOrder"
                    id="claimsOrder"
                    value={selectedClaimsOrder}
                    onChange={e => setSelectedClaimsOrder(e.target.value)}
                  >
                    <option value="mostRecent">Most Recent</option>
                    <option value="oldest">Oldest</option>
                  </select>
                  <va-button
                    onClick={() => setOrderClaimsBy(selectedClaimsOrder)}
                    data-testid="Sort travel claims"
                    text="Sort"
                    label="Sort"
                  />
                </div>
              </div>
              <div
                id="travel-claims-list"
                className="travel-claim-list-container"
              >
                <p id="pagination-info">
                  Showing {pageStart} ‒ {pageEnd} of {travelClaims.length}{' '}
                  events
                </p>
                <TravelPayFilters
                  statusesToFilterBy={statusesToFilterBy}
                  checkedStatuses={checkedStatuses}
                  onStatusFilterChange={onStatusFilterChange}
                  applyFilters={applyFilters}
                  resetSearch={resetSearch}
                />
                {displayedClaims.map(travelClaim =>
                  TravelClaimCard(travelClaim),
                )}
              </div>
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
      </article>

      {children}
    </div>
  );
}

App.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

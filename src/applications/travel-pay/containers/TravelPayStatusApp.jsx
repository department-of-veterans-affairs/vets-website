import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  isProfileLoading,
  isLoggedIn,
} from '@department-of-veterans-affairs/platform-user/selectors';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import PropTypes from 'prop-types';
import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import BreadCrumbs from '../components/Breadcrumbs';
import TravelClaimCard from '../components/TravelClaimCard';
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

  const statusFilterChange = (e, statusName) => {
    if (e.currentTarget.checked) {
      setCheckedStatuses([...checkedStatuses, statusName]);
    } else {
      setCheckedStatuses(
        checkedStatuses.filter(statusFilter => statusFilter !== statusName),
      );
    }
  };

  const isChecked = statusName => {
    return checkedStatuses.includes(statusName);
  };

  const {
    useToggleValue,
    useToggleLoadingValue,
    TOGGLE_NAMES,
  } = useFeatureToggle();

  const appEnabled = useToggleValue(TOGGLE_NAMES.travelPayPowerSwitch);
  const toggleIsLoading = useToggleLoadingValue();

  let displayedClaims = travelClaims;

  displayedClaims = displayedClaims.filter(claim =>
    appliedStatuses.includes(claim.claimStatus),
  );

  useEffect(
    () => {
      if (userLoggedIn) {
        dispatch(getTravelClaims());
      }
    },
    [dispatch, userLoggedIn],
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
      <main>
        <article className="row vads-u-padding-bottom--0">
          <div className="vads-l-row vads-u-margin-x--neg2p5">
            <div className="vads-u-padding-x--2p5">
              <BreadCrumbs />
              <h1 tabIndex="-1" data-testid="header">
                Check your travel reimbursement claim status
              </h1>
            </div>
            <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8">
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
                    <p id="pagination-info">
                      Showing 1 ‒ {travelClaims.length} of {travelClaims.length}{' '}
                      events
                    </p>
                    <div className="btsss-claims-order-container">
                      <p className="vads-u-margin-bottom--0">
                        Show appointments in this order
                      </p>
                      <div className="btsss-claims-order-select-container vads-u-margin-bottom--3">
                        <select
                          className="vads-u-margin-bottom--0"
                          hint={null}
                          name="claimsOrder"
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
                    <va-accordion bordered open-single>
                      <va-accordion-item
                        bordered="true"
                        header="Filter travel claims"
                      >
                        <legend>
                          <h2>Filter your results</h2>
                        </legend>
                        <div className="filter-your-results">
                          <fieldset id="status-filters">
                            <p>Travel claim status</p>
                            {statusesToFilterBy.map(status => (
                              <VaCheckbox
                                checked={isChecked(status)}
                                key={status}
                                label={status}
                                onVaChange={e => statusFilterChange(e, status)}
                              />
                            ))}
                            <div className="modal-button-wrapper">
                              <va-button
                                onClick={applyFilters}
                                data-testid="Apply filters"
                                text="Apply filters"
                                label="Apply filters"
                              />
                              <va-button
                                onClick={resetSearch}
                                data-testid="Reset search"
                                text="Reset search"
                                label="Reset search"
                              />
                            </div>
                          </fieldset>
                        </div>
                      </va-accordion-item>
                    </va-accordion>
                    {displayedClaims.map(travelClaim =>
                      TravelClaimCard(travelClaim),
                    )}
                  </>
                )}
              {userLoggedIn &&
                !isLoading &&
                !error &&
                travelClaims.length === 0 && <p>No travel claims to show.</p>}
            </div>
          </div>
        </article>
        <div className="row vads-u-margin-bottom--3">
          <hr />
          {/* TODO: determine functionality of this button */}
          <va-button class="float-right" text="Feedback" />
        </div>
      </main>

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

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  isProfileLoading,
  isLoggedIn,
} from '@department-of-veterans-affairs/platform-user/selectors';

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

  const { isLoading, travelClaims } = useSelector(state => state.travelPay);

  const [selectedClaimsOrder, setSelectedClaimsOrder] = useState('mostRecent');
  const [orderClaimsBy, setOrderClaimsBy] = useState('mostRecent');

  // TODO: Move this logic to the API-side
  switch (orderClaimsBy) {
    case 'mostRecent':
      travelClaims.sort(
        (a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate),
      );
      break;
    case 'oldest':
      travelClaims.sort(
        (a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate),
      );
      break;
    default:
      break;
  }

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
              {isLoading && (
                <va-loading-indicator
                  label="Loading"
                  message="Loading Travel Claims..."
                />
              )}
              {userLoggedIn ? (
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
                        text="Sort"
                      />
                    </div>
                  </div>
                  {travelClaims.map(travelClaim =>
                    TravelClaimCard(travelClaim),
                  )}

                  <HelpText />
                </>
              ) : (
                <>
                  <p>Log in to view your travel claims</p>
                  <va-button
                    text="Sign in"
                    onClick={() => dispatch(toggleLoginModal(true))}
                  />
                </>
              )}
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

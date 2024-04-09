import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  isProfileLoading,
  isLoggedIn,
} from '@department-of-veterans-affairs/platform-user/selectors';

import PropTypes from 'prop-types';
import BreadCrumbs from '../components/Breadcrumbs';
import TravelClaimCard from '../components/TravelClaimCard';
import { getTravelClaims, getUnauthPing } from '../redux/actions';

import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';

export default function App({ children }) {
  const dispatch = useDispatch();
  const profileLoading = useSelector(state => isProfileLoading(state));
  const userLoggedIn = useSelector(state => isLoggedIn(state));

  // TODO: utilize user info for authenticated requests
  // and validating logged in status
  // const user = useSelector(selectUser);

  const {
    isLoading,
    travelClaims,
    isFetchingUnauthPing,
    unauthPingResponse,
  } = useSelector(state => state.travelPay);

  const {
    useToggleValue,
    useToggleLoadingValue,
    TOGGLE_NAMES,
  } = useFeatureToggle();

  const appEnabled = useToggleValue(TOGGLE_NAMES.travelPayPowerSwitch);
  const toggleIsLoading = useToggleLoadingValue();

  async function handleUnauthButtonClick() {
    dispatch(getUnauthPing());
  }

  useEffect(
    () => {
      if (userLoggedIn) {
        dispatch(getTravelClaims());
      }
    },
    [dispatch, userLoggedIn],
  );

  if ((profileLoading || toggleIsLoading) && !userLoggedIn) {
    return (
      <div className="vads-l-grid-container vads-u-padding-y--3">
        <va-loading-indicator
          label="Loading"
          message="Please wait while we load the application for you."
        />
      </div>
    );
  }

  if (!appEnabled) {
    return document.location.replace('/');
  }

  return (
    <div className="vads-l-grid-container vads-u-padding-y--2">
      <BreadCrumbs />
      <h1 tabIndex="-1" data-testid="header">
        Check your travel reimbursement claim status
      </h1>
      <p className="va-introtext">Lead text</p>
      <p>Body text</p>
      <br />
      {!isFetchingUnauthPing ? (
        <>
          <va-button
            onClick={handleUnauthButtonClick}
            text="Unauthorized Ping"
          />
          <p>{unauthPingResponse}</p>
        </>
      ) : (
        <va-loading-indicator
          label="Fetching"
          message="Fetching unauthorized ping..."
        />
      )}

      <main>
        {isLoading ? (
          <va-loading-indicator
            label="Loading"
            message="Loading Travel Claims..."
          />
        ) : (
          travelClaims.map(travelClaim => TravelClaimCard(travelClaim))
        )}
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

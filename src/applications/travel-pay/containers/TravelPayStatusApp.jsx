import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isLoggedIn } from '@department-of-veterans-affairs/platform-user/selectors';

import PropTypes from 'prop-types';
import BreadCrumbs from '../components/Breadcrumbs';
import TravelClaimCard from '../components/TravelClaimCard';
import { getTravelClaims } from '../redux/actions';

export default function App({ children }) {
  const dispatch = useDispatch();
  const userLoggedIn = useSelector(state => isLoggedIn(state));

  // TODO: utilize user info for authenticated requests
  // and validating logged in status
  // const user = useSelector(selectUser);

  const { isLoading, travelClaims } = useSelector(state => state.travelPay);
  useEffect(
    () => {
      if (userLoggedIn) {
        dispatch(getTravelClaims());
      }
    },
    [dispatch, userLoggedIn],
  );

  return (
    <div className="vads-l-grid-container vads-u-padding-y--2">
      <BreadCrumbs />
      <h1 tabIndex="-1" data-testid="header">
        Check your travel reimbursement claim status
      </h1>
      <p className="va-introtext">Lead text</p>
      <p>Body text</p>
      <br />

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

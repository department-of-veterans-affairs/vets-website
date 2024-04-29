import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  isProfileLoading,
  isLoggedIn,
} from '@department-of-veterans-affairs/platform-user/selectors';

import PropTypes from 'prop-types';
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

  useEffect(
    () => {
      if (userLoggedIn) {
        dispatch(getTravelClaims());
      }
    },
    [dispatch, userLoggedIn],
  );

  if (profileLoading && !userLoggedIn) {
    return (
      <div className="vads-l-grid-container vads-u-padding-y--3">
        <va-loading-indicator
          label="Loading"
          message="Please wait while we load the application for you."
        />
      </div>
    );
  }

  return (
    <div>
      <main>
        <article className="row">
          <div className="vads-l-row vads-u-margin-x--neg2p5">
            <div className="vads-u-padding-x--2p5">
              <BreadCrumbs />
              <h1 tabIndex="-1" data-testid="header">
                Check your travel reimbursement claim status
              </h1>
            </div>
            <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8">
              {isLoading ? (
                <va-loading-indicator
                  label="Loading"
                  message="Loading Travel Claims..."
                />
              ) : (
                <>
                  <p className="vads-u-margin-bottom--0">
                    Show appointments in this order
                  </p>
                  <div className="btsss-claims-order-container">
                    <select
                      hint={null}
                      label="Show appointments in this order"
                      name="claimsOrder"
                      value={selectedClaimsOrder}
                      onChange={e => setSelectedClaimsOrder(e.target.value)}
                    >
                      <option value="mostRecent" selected>
                        Most Recent
                      </option>
                      <option value="oldest">Oldest</option>
                    </select>
                    <va-button
                      onClick={() => setOrderClaimsBy(selectedClaimsOrder)}
                      text="Sort"
                    />
                  </div>

                  <p id="pagination-info">
                    Showing 1 ‒ {travelClaims.length} of {travelClaims.length}{' '}
                    events
                  </p>
                  {travelClaims.map(travelClaim =>
                    TravelClaimCard(travelClaim),
                  )}
                </>
              )}
            </div>
            <div className="vads-l-col--12 vads-u-padding-x--2p5 vads-u-margin-top--5 medium-screen:vads-l-col--4">
              <HelpText />
            </div>
          </div>
        </article>
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

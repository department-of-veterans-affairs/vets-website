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
import {
  getTravelClaims,
  // getUnauthPing
} from '../redux/actions';

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
    // isFetchingUnauthPing,
    // unauthPingResponse,
  } = useSelector(state => state.travelPay);

  // async function handleUnauthButtonClick() {
  //   dispatch(getUnauthPing());
  // }

  const [filterBy, setFilterBy] = useState('mostRecent');

  switch (filterBy) {
    case 'mostRecent':
      console.log('sort by most recent'); // eslint-disable-line no-console
      travelClaims.sort(
        (a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate),
      );
      break;
    case 'oldest':
      console.log('sort by most oldest'); // eslint-disable-line no-console
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
    // <div className="vads-l-grid-container vads-u-padding-y--2">
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
                    Filter appointments by:
                  </p>
                  <div className="vaos-hide-for-print vads-l-row xsmall-screen:vads-u-border-bottom--0 vads-u-margin-bottom--3 small-screen:vads-u-margin-bottom--4 small-screen:vads-u-border-bottom--1px">
                    {/* vads-u-color--gray-medium"> */}
                    <nav
                      aria-label="Appointment list navigation"
                      className="vaos-appts__breadcrumb vads-u-flex--1 vads-u-padding-top--0p5"
                    >
                      <ul>
                        <li>
                          {filterBy === 'mostRecent' ? (
                            <strong className="vads-u-color--primary">
                              Most recent
                            </strong>
                          ) : (
                            <a onClick={() => setFilterBy('mostRecent')}>
                              Most recent
                            </a>
                          )}
                        </li>
                        <li>
                          {filterBy === 'oldest' ? (
                            <strong className="vads-u-color--primary">
                              Oldest
                            </strong>
                          ) : (
                            <a onClick={() => setFilterBy('oldest')}>Oldest</a>
                          )}
                        </li>
                      </ul>
                    </nav>
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

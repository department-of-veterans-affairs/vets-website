import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  // selectUser,
  // isProfileLoading,
  isLoggedIn,
} from '@department-of-veterans-affairs/platform-user/selectors';

import PropTypes from 'prop-types';
import AppointmentsTable from '../components/AppointmentsTable';
import Alert from '../components/Alert';
import BreadCrumbs from '../components/Breadcrumbs';
import { getTravelClaims } from '../redux/actions';

export default function App({ children }) {
  const dispatch = useDispatch();
  const userLoggedIn = useSelector(state => isLoggedIn(state));

  // TODO: check feature flag. Something like this:
  // const isLoadingFlags = useSelector(state => selectLoadingFeatureFlags(state));
  // const profileLoading = useSelector(state => isProfileLoading(state));
  // const isPlatformLoading = isLoadingFlags || profileLoading;

  // const user = useSelector(selectUser);
  // console.log(user); // eslint-disable-line no-console

  const { isLoading /* isError, travelClaims, error */ } = useSelector(
    state => state.travelPay,
  );

  useEffect(
    () => {
      if (userLoggedIn) {
        console.log('in useEffect'); // eslint-disable-line no-console
        dispatch(getTravelClaims());
      }
    },
    [dispatch, userLoggedIn],
  );

  return (
    <div className="vads-l-grid-container vads-u-padding-y--2">
      <BreadCrumbs />
      <h1 tabIndex="-1" data-testid="header">
        Beneficiary Travel Self Service
      </h1>
      <p className="va-introtext">Lead text</p>
      <p>Body text</p>
      <Alert />
      <br />

      <main>
        {isLoading ? (
          <va-loading-indicator
            label="Loading"
            message="Loading Travel Claims..."
          />
        ) : (
          <AppointmentsTable />
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

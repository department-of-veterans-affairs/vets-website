import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { isLoggedIn } from 'platform/user/selectors';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import { fetchDebts } from '../actions';

export default function App({ children, location }) {
  const dispatch = useDispatch();

  const userLoggedIn = useSelector(state => isLoggedIn(state));
  const { isDebtPending } = useSelector(state => state.availableDebts);
  const isLoadingFeatures = useSelector(state => toggleValues(state).loading);

  useEffect(
    () => {
      if (userLoggedIn) {
        fetchDebts(dispatch);
      }
    },
    [dispatch, userLoggedIn],
  );

  // only need to show loading for debt pending if user is logged in
  if ((userLoggedIn && isDebtPending) || isLoadingFeatures) {
    return (
      <va-loading-indicator
        label="Loading"
        message="Loading application..."
        set-focus
      />
    );
  }

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}

App.propTypes = {
  children: PropTypes.element,
  isDebtPending: PropTypes.bool,
  location: PropTypes.object,
};

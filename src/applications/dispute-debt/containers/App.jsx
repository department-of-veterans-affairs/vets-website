import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { isLoggedIn } from 'platform/user/selectors';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import { fetchDebts } from '../actions';

export default function App({ children, location }) {
  const dispatch = useDispatch();
  const { isDebtPending } = useSelector(state => state.availableDebts);
  const userLoggedIn = useSelector(state => isLoggedIn(state));

  useEffect(
    () => {
      if (userLoggedIn) {
        fetchDebts(dispatch);
      }
    },
    [dispatch, userLoggedIn],
  );

  if (isDebtPending) {
    return (
      <va-loading-indicator
        label="Loading"
        message="Loading your information..."
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

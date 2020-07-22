import React from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';

import formConfig from '../config/form';

function App({ location, children, isLoggedIn, isLoading, vaFileNumber }) {
  const content = (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );

  // If on intro page, just return
  if (location.pathname === '/introduction') {
    return content;
  }

  // Handle loading
  if (isLoading) {
    return <LoadingIndicator message="Loading your information..." />;
  }

  // If a user is not logged in OR
  // a user is logged in, but hasn't gone through va file number validation
  // redirect them to the introduction page.
  if (
    !isLoggedIn ||
    (isLoggedIn && !vaFileNumber?.hasVaFileNumber?.validVaFileNumber)
  ) {
    document.location.replace(
      '/view-change-dependents/add-remove-form-686c/introduction',
    );
    return <LoadingIndicator message="Redirecting to introduction page..." />;
  }

  return content;
}

const mapStateToProps = state => ({
  isLoggedIn: state?.user?.login?.currentlyLoggedIn,
  isLoading: state?.user?.profile?.loading,
  vaFileNumber: state?.vaFileNumber,
});

export default connect(mapStateToProps)(App);

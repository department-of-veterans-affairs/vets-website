import React, { useEffect } from 'react';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import ErrorMessage from '../components/ErrorMessage';
import { fetchFormStatus } from '../actions/index';

const App = ({
  location,
  children,
  isError,
  pending,
  isLoggedIn,
  getFormStatus,
}) => {
  const showMainContent = !pending && !isError;

  useEffect(
    () => {
      getFormStatus();
    },
    [getFormStatus],
  );

  return (
    <>
      {pending && (
        <LoadingIndicator setFocus message="Loading your information..." />
      )}
      {isError &&
        !pending &&
        isLoggedIn && (
          <div className="row vads-u-margin-bottom--3">
            <ErrorMessage />
          </div>
        )}
      {showMainContent && (
        <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
          {children}
        </RoutedSavableApp>
      )}
    </>
  );
};

const mapStateToProps = state => ({
  isLoggedIn: state.user.login.currentlyLoggedIn,
  isError: state.fsr.isError,
  pending: state.fsr.pending,
});

const mapDispatchToProps = dispatch => ({
  getFormStatus: () => dispatch(fetchFormStatus()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);

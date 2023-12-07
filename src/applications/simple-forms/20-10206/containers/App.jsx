import React, { useEffect } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { setData } from '@department-of-veterans-affairs/platform-forms-system/actions';
import { isLoggedIn, isLOA3 } from 'platform/user/selectors';

import formConfig from '../config/form';

const App = props => {
  const {
    children,
    formData,
    isLoading,
    setFormData,
    userIdVerified,
    userLoggedIn,
    location,
  } = props;

  useEffect(
    // add view-fields to formData to support
    // conditional-pages based on User identity-verification
    () => {
      if (!isLoading) {
        setFormData({
          ...formData,
          'view:userLoggedIn': userLoggedIn,
          'view:userIdVerified': userIdVerified,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading, userLoggedIn],
  );

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
};

App.propTypes = {
  children: PropTypes.node.isRequired,
  formData: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  userIdVerified: PropTypes.bool,
  userLoggedIn: PropTypes.bool,
};

const mapStateToProps = state => ({
  formData: state.form.data,
  isLoading: state.featureToggles.loading,
  userIdVerified: isLOA3(state),
  userLoggedIn: isLoggedIn(state),
});

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);

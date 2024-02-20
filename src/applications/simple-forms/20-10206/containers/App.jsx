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
    setFormData,
    userIdVerified,
    userLoggedIn,
    location,
  } = props;

  useEffect(
    // add view-fields to formData to support
    // conditional-pages based on User identity-verification
    () => {
      if (formData['view:userLoggedIn'] !== userLoggedIn) {
        setFormData({
          ...formData,
          'view:userLoggedIn': userLoggedIn,
        });
      }
      if (formData['view:userIdVerified'] !== userIdVerified) {
        setFormData({
          ...formData,
          'view:userLoggedIn': userLoggedIn,
          'view:userIdVerified': userIdVerified,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userIdVerified, userLoggedIn],
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
  location: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  userIdVerified: PropTypes.bool.isRequired,
  userLoggedIn: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  formData: state.form.data,
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

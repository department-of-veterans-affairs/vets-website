import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import formConfig from '../config/form';

export const App = ({ location, children, user }) => {
  const serviceRequired = [backendServices.USER_PROFILE];

  return (
    <RequiredLoginView serviceRequired={serviceRequired} user={user} verify>
      <RoutedSavableApp
        formConfig={formConfig}
        currentLocation={location}
        skipPrefill
      >
        {children}
      </RoutedSavableApp>
    </RequiredLoginView>
  );
};
App.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  location: PropTypes.object,
  user: PropTypes.shape({
    profile: PropTypes.shape({}),
  }),
};

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(App);

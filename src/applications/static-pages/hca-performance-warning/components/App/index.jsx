import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export const App = ({ show }) => {
  return show ? (
    <va-alert status="warning" slim uswds>
      <p className="vads-u-margin-y--0">This will be the alert content.</p>
    </va-alert>
  ) : null;
};

App.propTypes = {
  show: PropTypes.bool,
};

const mapStateToProps = state => ({
  show: state.featureToggles.hcaPerformanceAlertEnabled,
});

export default connect(mapStateToProps)(App);

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleLoginModal as toggleLoginModalAction } from 'platform/site-wide/user-nav/actions';

const CheckAppStatusAlert = ({ toggleLoginModal }) => (
  <va-alert status="info" data-testid="hca-check-status-alert" uswds>
    <h2 slot="headline">Have you applied for VA health care before?</h2>
    <va-button
      text="Sign in to check your application status"
      onClick={() => toggleLoginModal(true, 'hcainfo')}
      data-testid="hca-login-alert-button"
      uswds
    />
  </va-alert>
);

CheckAppStatusAlert.propTypes = {
  toggleLoginModal: PropTypes.func,
};

const mapDispatchToProps = {
  toggleLoginModal: toggleLoginModalAction,
};

export default connect(
  null,
  mapDispatchToProps,
)(CheckAppStatusAlert);

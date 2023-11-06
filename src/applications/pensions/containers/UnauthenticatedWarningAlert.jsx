import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { toggleLoginModal as toggleLoginModalAction } from 'platform/site-wide/user-nav/actions';

const UnauthenticatedAlert = ({ toggleLoginModal }) => {
  const showLoginModal = e => {
    e.preventDefault();
    toggleLoginModal(true);
  };
  return (
    <va-alert status="warning" uswds slim>
      <React.Fragment key=".1">
        <p className="vads-u-margin-y--0">
          This application is 7 steps long and it contains several substeps per
          step. We advise you{' '}
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href="#" onClick={showLoginModal}>
            sign in to save your progress
          </a>
          .
        </p>
        <p>
          <strong>Note:</strong> You can sign in after you start your
          application. But you’ll lose any information you already filled in.
        </p>
      </React.Fragment>
    </va-alert>
  );
};

UnauthenticatedAlert.propTypes = {
  toggleLoginModal: PropTypes.func,
};

const mapDispatchToProps = {
  toggleLoginModal: toggleLoginModalAction,
};

export default connect(
  null,
  mapDispatchToProps,
)(UnauthenticatedAlert);

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';

const UnauthenticatedWarningAlert = () => {
  const isLoggedIn = useSelector(state => state.user.login.currentlyLoggedIn);
  const dispatch = useDispatch();

  const showLoginModal = e => {
    e.preventDefault();
    dispatch(toggleLoginModal(true));
  };

  if (isLoggedIn) {
    return null;
  }

  return (
    <va-alert status="warning" uswds slim>
      <p className="vads-u-margin-y--0">
        This application is 7 steps long and it contains several substeps per
        step. We advise you{' '}
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a href="#" className="usa-link" onClick={showLoginModal}>
          sign in to save your progress
        </a>
        .
      </p>
      <p>
        <strong>Note:</strong> You can sign in after you start your application.
        But you’ll lose any information you already filled in.
      </p>
    </va-alert>
  );
};

UnauthenticatedWarningAlert.propTypes = {
  isLoggedIn: PropTypes.bool,
  toggleLoginModal: PropTypes.func,
};

export default UnauthenticatedWarningAlert;

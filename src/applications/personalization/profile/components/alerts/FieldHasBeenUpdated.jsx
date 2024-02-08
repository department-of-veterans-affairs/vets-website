import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

export const FieldHasBeenUpdated = ({ history = window.history }) => {
  const location = useLocation();
  const locationState = useLocation().state;
  const { fieldInfo = null } = locationState || {};

  // on chrome if you don't clear out browser history state, it will show the
  // alert after refresh. this useEffect clears the state after alert is shown
  useEffect(() => {
    if (location.state?.fieldInfo) {
      history.replaceState(null, '');
    }
  }, []);

  const text = `We saved your ${fieldInfo?.title?.toLowerCase() ||
    `information`} to your profile.`;

  return fieldInfo ? (
    <va-alert
      class="vads-u-margin-bottom--1"
      background-only
      status="success"
      role="alert"
      uswds
    >
      <p className="vads-u-margin-y--0">{text}</p>
    </va-alert>
  ) : null;
};

FieldHasBeenUpdated.propTypes = {
  history: PropTypes.object,
};

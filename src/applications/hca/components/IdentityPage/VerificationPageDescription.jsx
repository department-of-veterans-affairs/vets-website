import React from 'react';
import PropTypes from 'prop-types';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';

const VerificationPageDescription = ({ onLogin }) => (
  <>
    <FormTitle title="Before you start your application" />
    <p>
      We need some information before you can start your application. This will
      help us fit your application to your specific needs.
    </p>
    <p>Then you can fill out the VA health care application (10-10EZ).</p>
    <p className="vads-u-font-weight--bold">Sign in and save time</p>
    <p>
      You can sign in and confirm that the information we have for you is up to
      date and then fill out the VA health care application.
    </p>
    {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component */}
    <button
      type="button"
      onClick={onLogin}
      className="va-button-link"
      data-testid="hca-login-button"
    >
      Sign in to start your application.
    </button>
  </>
);

VerificationPageDescription.propTypes = {
  onLogin: PropTypes.func,
};

export default VerificationPageDescription;

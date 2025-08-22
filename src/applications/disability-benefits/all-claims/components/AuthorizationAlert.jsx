import React from 'react';
import PropTypes from 'prop-types';
import BasicLink from './BasicLink';

export const EVIDENCE_PRIVATE_MEDICAL_RECORDS =
  'supporting-evidence/private-medical-records';

const AuthorizationAlert = ({ hasError, onAnchorClick }) => (
  <va-alert status="error" visible={hasError} role="alert">
    <h3 slot="headline">
      Authorize your providers to release your records or upload them yourself
    </h3>
    <p className="vads-u-margin-bottom--0">
      You must give us permission to get your non-VA treatment records.
    </p>
    <va-link
      class="vads-u-display--block"
      href="#privacy-agreement"
      onClick={onAnchorClick}
      id="checkbox-anchor"
      text="Check the box to authorize"
    />
    <p className="vads-u-margin-bottom--0">
      <strong>Or</strong>, you can change to provide your non-VA treatment
      records by uploading them.
    </p>
    <BasicLink
      data-testid="goBack"
      className="vads-u-display--block"
      path={`/${EVIDENCE_PRIVATE_MEDICAL_RECORDS}`}
      text="Change how to provide your non-VA treatment records"
    />
  </va-alert>
);

AuthorizationAlert.propTypes = {
  hasError: PropTypes.bool.isRequired,
  onAnchorClick: PropTypes.func.isRequired,
};

export default AuthorizationAlert;

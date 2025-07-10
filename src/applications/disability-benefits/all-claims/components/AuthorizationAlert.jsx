import React from 'react';
import PropTypes from 'prop-types';
import BasicLink from './BasicLink';

export const EVIDENCE_PRIVATE_REQUEST =
  'supporting-evidence/request-private-medical-records';

const AuthorizationAlert = ({ hasError, onAnchorClick }) => (
  <va-alert status="error" visible={hasError} role="alert">
    <h3 slot="headline">
      Authorize your providers to release your records or upload them yourself
    </h3>
    <p className="vads-u-margin-bottom--0">
      If you want us to request your non-VA medical records from your provider,
      you must authorize the release by checking the box labeled "I acknowledge
      and authorize this release of information."
    </p>
    <va-link
      class="vads-u-display--block vads-u-margin-top--2"
      href="#privacy-agreement"
      onClick={onAnchorClick}
      id="checkbox-anchor"
      text="Check the box to authorize"
    />
    <p className="vads-u-margin-bottom--0">
      <strong>Or</strong>, go back a page and select ‘No’ where we ask if you
      want us to get your non-VA medical records. You’ll be able to upload
      non-VA records later in the form or by mail.
    </p>
    <BasicLink
      className="vads-u-display--block vads-u-margin-top--2"
      path={`/${EVIDENCE_PRIVATE_REQUEST}`}
      text="Go back to select ‘No’"
    />
  </va-alert>
);

AuthorizationAlert.propTypes = {
  hasError: PropTypes.bool.isRequired,
  onAnchorClick: PropTypes.func.isRequired,
};

export default AuthorizationAlert;

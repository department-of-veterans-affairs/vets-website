import React from 'react';
import PropTypes from 'prop-types';
import { EVIDENCE_PRIVATE_REQUEST } from '../../constants';
import BasicLink from '../../../shared/components/web-component-wrappers/BasicLink';

const AuthorizationAlert = ({ hasError, onAnchorClick }) => (
  <va-alert status="error" visible={hasError} role="alert">
    <h3 slot="headline">
      Authorize your doctor to release your records or upload them yourself
    </h3>
    <p className="vads-u-margin-bottom--0">
      If you want us to request your non-VA medical records from your doctor,
      you must authorize the release.
    </p>
    <va-link
      disable-analytics
      href="#privacy-agreement"
      onClick={onAnchorClick}
      id="checkbox-anchor"
      text="Check box to authorize"
    />
    <p className="vads-u-margin-bottom--0">
      Or, go back a page and select <strong>No</strong> where we ask about
      non-VA medical records. Then you can upload your records or submit a
      21-4142 and 21-4142a after submitting this form.
    </p>
    <BasicLink
      disableAnalytics
      path={`/${EVIDENCE_PRIVATE_REQUEST}`}
      text="Go back to upload records"
    />
  </va-alert>
);

AuthorizationAlert.propTypes = {
  hasError: PropTypes.bool.isRequired,
  onAnchorClick: PropTypes.func.isRequired,
};

export default AuthorizationAlert;

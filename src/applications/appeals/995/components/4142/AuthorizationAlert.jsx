import React from 'react';
import PropTypes from 'prop-types';
import { EVIDENCE_PRIVATE_PROMPT_URL } from '../../constants';
import BasicLink from '../../../shared/components/web-component-wrappers/BasicLink';
import { alertTitle } from '../../content/evidence/form4142';

const AuthorizationAlert = ({ hasError, onAnchorClick }) => (
  <va-alert status="error" visible={hasError} role="alert">
    <h3 slot="headline">{alertTitle}</h3>
    <p className="vads-u-margin-bottom--0">
      If you want us to request your medical records from a private (non-VA)
      provider, you need to authorize their release.
    </p>
    <va-link
      class="vads-u-display--block"
      href="#privacy-agreement"
      onClick={onAnchorClick}
      id="checkbox-anchor"
      text="Check the box to authorize"
    />
    <p className="vads-u-margin-bottom--0">
      <strong>If you don’t want us to request your medical records</strong> from
      any private providers, you can go back to change your selection. You can
      still upload your medical records later in the form or submit them by
      mail.
    </p>
    <BasicLink
      className="vads-u-display--block"
      path={`/${EVIDENCE_PRIVATE_PROMPT_URL}`}
      text="Go back to change your selection"
    />
  </va-alert>
);

AuthorizationAlert.propTypes = {
  hasError: PropTypes.bool.isRequired,
  onAnchorClick: PropTypes.func.isRequired,
};

export default AuthorizationAlert;

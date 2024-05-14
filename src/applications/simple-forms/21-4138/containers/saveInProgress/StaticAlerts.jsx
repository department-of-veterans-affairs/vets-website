import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom-v5-compat';
import {
  VaAlert,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export const UnverifiedPrefillAlert = ({ appType }) => (
  <div>
    <VaAlert status="info" uswds visible>
      <div className="usa-alert-body">
        <strong>Note:</strong> Since you’re signed in to your account, we can
        prefill part of your {appType} based on your account details. You can
        also save your {appType} in progress and come back later to finish
        filling it out.
      </div>
    </VaAlert>
    <br />
  </div>
);

UnverifiedPrefillAlert.propTypes = {
  appType: PropTypes.string.isRequired,
};

export const PrefillUnavailableAlert = ({ appType }) => (
  <div>
    <VaAlert status="info" uswds visible>
      <div className="usa-alert-body">
        You can save this {appType} in progress, and come back later to finish
        filling it out.
      </div>
    </VaAlert>
    <br />
  </div>
);

PrefillUnavailableAlert.propTypes = {
  appType: PropTypes.string.isRequired,
};

export const DefaultAlert = ({
  appType,
  ariaDescribedby,
  ariaLabel,
  onClick,
}) => {
  return (
    <div>
      <VaAlert status="info" uswds visible>
        <div className="usa-alert-body">
          You can save this {appType} in progress, and come back later to finish
          filling it out.
          <br />
          <VaButton
            className="va-button-link"
            onClick={onClick}
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedby}
            text="Sign in to your account."
          />
        </div>
      </VaAlert>
      <br />
    </div>
  );
};

DefaultAlert.propTypes = {
  appType: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  ariaDescribedby: PropTypes.string,
  ariaLabel: PropTypes.string,
};

export const ButtonOnlyAlert = props => {
  const {
    appType,
    ariaDescribedby,
    ariaLabel,
    hideUnauthedStartLink,
    onClick,
    to,
    unauthStartButton,
  } = props;
  return (
    <>
      {unauthStartButton}
      {!hideUnauthedStartLink && (
        <p>
          <Link
            onClick={onClick}
            to={to}
            className="schemaform-start-button"
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedby}
          >
            Start your {appType} without signing in
          </Link>
        </p>
      )}
    </>
  );
};

ButtonOnlyAlert.propTypes = {
  appType: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  ariaDescribedby: PropTypes.string,
  ariaLabel: PropTypes.string,
  hideUnauthedStartLink: PropTypes.bool,
  unauthStartButton: PropTypes.any,
};

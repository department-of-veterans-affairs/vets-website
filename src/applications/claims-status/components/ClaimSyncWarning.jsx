import React from 'react';
import PropTypes from 'prop-types';

export default function ClaimSyncWarning({ olderVersion }) {
  let additionalText;
  if (olderVersion) {
    additionalText =
      ' This is an older version of your claim and may be outdated.';
  }

  function handleClick(e) {
    e.preventDefault();
    return window.location.reload();
  }

  return (
    <div className="usa-alert usa-alert-warning claims-alert claims-alert-status">
      <div className="usa-alert-body">
        <h4 className="usa-alert-heading">Claim status is temporarily down</h4>
        <p className="usa-alert-text">
          Please refresh the page or try again later.
          {additionalText}
        </p>
        <va-button
          primary
          class="vads-u-margin-top--1"
          text="Refresh the page"
          onClick={handleClick}
          uswds
        />
      </div>
    </div>
  );
}

ClaimSyncWarning.propTypes = {
  olderVersion: PropTypes.bool,
};

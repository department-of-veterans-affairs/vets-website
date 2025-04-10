import React from 'react';
import PropTypes from 'prop-types';

export function Unauth({ toggleLoginModal, DynamicHeader }) {
  return (
    <va-alert close-btn-aria-label="Close notification" status="info" visible>
      <DynamicHeader
        className="vads-u-margin-bottom--2"
        id="track-your-status-on-mobile"
        slot="headline"
      >
        Sign in with a verified account to check if you have an accredited
        representative
      </DynamicHeader>

      <va-button
        text="Sign in or create an account"
        uswds
        onClick={() => toggleLoginModal(true)}
      />
    </va-alert>
  );
}

Unauth.propTypes = {
  DynamicHeader: PropTypes.elementType.isRequired,
  headingLevel: PropTypes.number,
  toggleLoginModal: PropTypes.func,
};

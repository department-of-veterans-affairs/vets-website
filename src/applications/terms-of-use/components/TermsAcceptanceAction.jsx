import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { termsOfUseEnabled } from '@department-of-veterans-affairs/platform-user/exports';

export default function TermsAcceptance({
  error,
  isMiddleAuth,
  handleTouClick,
  setShowDeclineModal,
  isFullyAuthenticated,
  isUnauthenticated,
}) {
  const termsOfUseAuthorized = useSelector(termsOfUseEnabled);
  const className = isUnauthenticated ? 'hidden' : '';
  return (
    <>
      <h2 id="do-you-accept-of-terms-of-use" className={className}>
        Do you accept these terms of use?
      </h2>
      {error.isError && (
        <va-alert
          status="error"
          slim
          visible
          uswds
          data-testid="error-non-modal"
          class="vads-u-margin-y--1p5"
        >
          {error.message}
        </va-alert>
      )}
      {(isMiddleAuth || isFullyAuthenticated) &&
        termsOfUseAuthorized && (
          <>
            <va-button
              data-testid="accept"
              text={`${
                isFullyAuthenticated && !isMiddleAuth
                  ? 'Continue to accept'
                  : 'Accept'
              }`}
              onClick={() => handleTouClick('accept')}
              ariaLabel="I accept the VA online services terms of use"
            />
            <va-button
              data-testid="decline"
              text="Decline"
              secondary
              ariaLabel="I decline the VA online services terms of use"
              onClick={() => setShowDeclineModal(true)}
            />
          </>
        )}
    </>
  );
}

TermsAcceptance.propTypes = {
  error: PropTypes.object,
  handleTouClick: PropTypes.func,
  isFullyAuthenticated: PropTypes.bool,
  isMiddleAuth: PropTypes.bool,
  isUnauthenticated: PropTypes.bool,
  setShowDeclineModal: PropTypes.func,
};

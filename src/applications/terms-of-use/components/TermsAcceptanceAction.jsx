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
  isDisabled = false,
}) {
  const termsOfUseAuthorized = useSelector(termsOfUseEnabled);
  const className = isUnauthenticated ? 'hidden' : '';
  const acceptBtnText =
    isFullyAuthenticated && !isMiddleAuth ? 'Continue to accept' : 'Accept';
  return (
    <>
      {(isMiddleAuth || isFullyAuthenticated) &&
        termsOfUseAuthorized && (
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
            <va-button
              disabled={isDisabled}
              data-testid="accept"
              text={acceptBtnText}
              onClick={() => handleTouClick('accept')}
              ariaLabel="Accept the VA online services terms of use"
            />
            <va-button
              disabled={isDisabled}
              data-testid="decline"
              text="Decline"
              secondary
              ariaLabel="Decline the VA online services terms of use"
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
  isDisabled: PropTypes.bool,
  isFullyAuthenticated: PropTypes.bool,
  isMiddleAuth: PropTypes.bool,
  isUnauthenticated: PropTypes.bool,
  setShowDeclineModal: PropTypes.func,
};

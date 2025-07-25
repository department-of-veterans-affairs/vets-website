import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { COOKIES, CLIENT_IDS } from 'platform/utilities/oauth/constants';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import ContactCenterInformation from 'platform/user/authentication/components/ContactCenterInformation';
import { touStyles } from '../constants';

export default function Declined() {
  const shouldRedirectToMobile =
    sessionStorage.getItem(COOKIES.CI) === CLIENT_IDS.VAMOBILE;
  const dispatch = useDispatch();
  const openSignInModal = useCallback(
    () => {
      if (shouldRedirectToMobile) {
        sessionStorage.removeItem(COOKIES.CI);
        window.location = `vamobile://login-terms-rejected`;
      } else {
        dispatch(toggleLoginModal(true));
      }
    },
    [dispatch, shouldRedirectToMobile],
  );

  return (
    <div className="vads-l-grid-container vads-u-padding-y--5">
      {shouldRedirectToMobile && <style>{touStyles}</style>}
      <div className="usa-content">
        <h1>We’ve signed you out</h1>
        <p>
          You declined the VA online services terms of use, so we've signed you
          out.
        </p>
        <h2>What you can do</h2>
        <p>
          You can sign in again anytime to accept the terms. As soon as you
          accept the terms, you can manage your benefits and care online again.
        </p>
        <p>
          <strong>Note:</strong> You can still access your VA benefits and
          health care without using our online services. If you need help or
          have questions, call our MYVA411 main information line at{' '}
          <ContactCenterInformation /> We’re here 24/7.
        </p>
        <p className="vads-u-margin-y--2p5">
          <va-link
            href="https://va.gov/terms-of-use/"
            text="Review the terms of use"
          />
        </p>
        <va-button text="Sign in" onClick={openSignInModal} />
      </div>
    </div>
  );
}

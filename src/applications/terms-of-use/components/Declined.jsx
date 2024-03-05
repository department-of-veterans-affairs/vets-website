import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { COOKIES, CLIENT_IDS } from 'platform/utilities/oauth/constants';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import IdentityPhone from 'platform/user/authentication/components/IdentityPhone';
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
          You can still get VA health care and benefits without using our online
          services. If you need help or have questions, <IdentityPhone /> We’re
          here 24/7.
        </p>

        <p>
          Or you can change your answer and accept the terms. If you want to
          accept the terms, follow these steps:
          <ol type="1">
            <li> Quit your browser.</li>
            <li> Reopen your browser Go to VA.gov and sign in again.</li>
            <li> We’ll take you back to the terms of use.</li>
            <li>
              {' '}
              Select <b>“Accept”</b> to continue using VA online services.
            </li>
          </ol>
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

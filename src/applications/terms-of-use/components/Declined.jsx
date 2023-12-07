import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { COOKIES, CLIENT_IDS } from 'platform/utilities/oauth/constants';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
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
          services. If you need help or have questions, call us at{' '}
          <va-telephone contact={CONTACTS.VA_411} />, select 0 (
          <va-telephone contact={CONTACTS[711]} tty />
          ). We’re here 24/7.
        </p>
        <p>
          Or you can change your answer and accept the terms. If you want to
          accept the terms, sign in again. We’ll take you back to the terms of
          use. Then you can continue using VA online services.
        </p>
        <va-button text="Sign in" onClick={openSignInModal} />
      </div>
    </div>
  );
}

import React from 'react';
import { useSelector } from 'react-redux';
import Modal from '@department-of-veterans-affairs/component-library/Modal';

import * as authUtilities from 'platform/user/authentication/utilities';
import recordEvent from '../../../monitoring/record-event';
import { isAuthenticatedWithOAuth } from '../selectors';

const OrganicAdoptionExperimentModal = ({ visible = false, onClose }) => {
  const useOAuth = useSelector(isAuthenticatedWithOAuth);

  function setDismissalCookie() {
    const date = new Date();
    localStorage.setItem('dismiss_organic_adoption_modal', `${date}`);
  }

  return (
    <Modal
      id="loginGovExperimentModal"
      modalTitle="Use one account and password for secure, private access to government agencies"
      large
      visible={visible}
      click-to-close
      onCloseEvent={() => {
        setDismissalCookie();
        recordEvent({ event: 'organic-experiment-dismiss-modal' });
        onClose();
      }}
      onPrimaryButtonClick={async () => {
        setDismissalCookie();
        recordEvent({
          event: 'cta-button-click',
          'button-type': 'primary-button',
          'button-click-label': '(organic experiment) Get Login.gov now',
        });
        location.href = await authUtilities.signupOrVerify({
          policy: 'logingov',
          isLink: true,
          allowVerification: false,
          useOAuth,
        });
      }}
      onSecondaryButtonClick={() => {
        recordEvent({
          event: 'cta-button-click',
          'button-type': 'secondary-button',
          'button-click-label': '(organic experiment) Learn more',
        });
        location.href =
          'https://www.va.gov/resources/signing-in-to-vagov/#should-i-create-a-logingov-or-';
      }}
      primaryButtonText="Get Login.gov now"
      secondaryButtonText="Learn more"
    >
      <div className="modal-content">
        <p>
          As part of VA’s continued effort to make it easier and safer for you
          to access and manage the benefits you’ve earned, we recommend
          Login.gov as the best option for Veterans to use when signing into VA
          digital tools and products online.
        </p>
        <p>
          Login.gov is an easy-to-use, secure sign in service used by the public
          to sign in to participating government websites. It is built on the
          most modern security standards to protect your data and you can use
          the same username and password to sign in to any website that partners
          with Login.gov. Partners include—USAJOBS, TSA pre-check, Small
          Business Administration, and more.
        </p>
        <p>
          <b>Estimated time to complete:</b> 20 mins
        </p>
        <p>
          <b>What you will need:</b>
        </p>
        <ul>
          <li>State issued I.D.</li>
          <li>Social Security Number</li>
          <li>A phone number where you can be reached</li>
        </ul>
      </div>
    </Modal>
  );
};

export default OrganicAdoptionExperimentModal;

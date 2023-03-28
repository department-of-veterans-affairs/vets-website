import React, { useEffect, useState } from 'react';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import * as authUtilities from 'platform/user/authentication/utilities';
import { getQueryParams } from '../utilities';
import recordEvent from '../../../monitoring/record-event';
import { externalApplicationsConfig } from '../usip-config';

const OrganicAdoptionExperimentModal = ({ visible = false, onClose }) => {
  const [useOAuth, setOAuth] = useState();
  const { OAuth } = getQueryParams();
  const { OAuthEnabled } = externalApplicationsConfig.default;

  useEffect(
    () => {
      setOAuth(OAuthEnabled && OAuth === 'true');
    },
    [OAuth, OAuthEnabled],
  );

  let logingovSingUpLink;
  // uses logic from CreateAccountLink component
  async function generateURL() {
    const url = await authUtilities.signupOrVerify({
      policy: 'logingov',
      isLink: true,
      allowVerification: false,
      useOAuth,
    });
    logingovSingUpLink = url;
  }
  generateURL();

  function setDismissalCookie() {
    const date = new Date();
    localStorage.setItem('dismiss_organic_adoption_modal', `${date}`);
  }

  return (
    <VaModal
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
      onPrimaryButtonClick={() => {
        setDismissalCookie();
        recordEvent({
          event: 'cta-button-click',
          'button-type': 'primary-button',
          'button-click-label': '(organic experiment) Get Login.gov now',
        });
        location.href = logingovSingUpLink;
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
      data-testid="copy-address-success"
    >
      <div className="modal-content" data-testid="modal-content">
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
    </VaModal>
  );
};

export default OrganicAdoptionExperimentModal;

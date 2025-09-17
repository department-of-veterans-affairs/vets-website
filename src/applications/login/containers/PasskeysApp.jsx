/* eslint-disable camelcase */
/* eslint-disable no-console */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  browserSupportsWebAuthn,
  platformAuthenticatorIsAvailable,
  startRegistration,
  startAuthentication,
} from '@simplewebauthn/browser';

export default function PasskeysContainer() {
  const [message, setMessage] = useState('');
  const isLoggedIn = useSelector(
    state => state?.user?.login?.currentlyLoggedIn,
  );
  const canUseWebAuth =
    browserSupportsWebAuthn() && platformAuthenticatorIsAvailable();

  const handleOnClick = async e => {
    e.preventDefault();

    // ### Passkeys Registration ####
    const optionsResponse = await fetch(
      'http://localhost:3000/sign_in/webauthn/registrations/options',
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': localStorage.getItem('csrfToken'),
        },
      },
    );

    const { options, challenge_id: challengeId } = await optionsResponse.json();

    let registrationData;

    try {
      registrationData = await startRegistration(options);
      console.log('Registration successful:', registrationData);
    } catch (error) {
      if (error.name === 'InvalidStateError') {
        console.log('Error: Authr was probably already registered by user');
      } else {
        console.log(error);
      }
      throw error;
    }

    try {
      const verificationResp = await fetch(
        'http://localhost:3000/sign_in/webauthn/registrations/verify',
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': localStorage.getItem('csrfToken'),
          },
          body: JSON.stringify({
            registration: registrationData,
            challenge_id: challengeId,
          }),
        },
      );

      const verificationJSON = await verificationResp.json();

      if (verificationJSON && verificationJSON.verified) {
        setMessage('Successfully registered a passkey');
      } else {
        setMessage('Something went wrong');
      }
    } catch (error) {
      console.error('Response was bad', error);
      throw error;
    }
  };

  // ### Passkeys Authentication ####
  const handleSignIn = async e => {
    e.preventDefault();

    const getAuthOpts = await fetch(
      'http://localhost:3000/sign_in/webauthn/authentications/options',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const { options, challenge_id: challengeId } = await getAuthOpts.json();

    const attest = await startAuthentication(options, false);

    try {
      const verifyAuth = await fetch(
        'http://localhost:3000/sign_in/webauthn/authentications/verify',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            attest,
            challenge_id: challengeId,
          }),
        },
      );

      const verifyJSON = await verifyAuth.json();

      console.log({ verifyJSON });
      if (verifyJSON && verifyJSON.verified) {
        localStorage.setItem('hasSession', true);
        setMessage('Fully authenticated');
      } else {
        setMessage('Something went wrong with auth');
      }
    } catch (error) {
      console.error('Response was bad', error);
      throw error;
    }
  };

  // if (!browserSupportsWebAuthn() || !platformAuthenticatorIsAvailable()) {
  //   return null;
  // }

  if (!canUseWebAuth) {
    return (
      <div>
        <p>We're sorry but it looks like your device cannot use passkeys.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>
        {isLoggedIn ? 'Register your passkey' : 'Login with your passkey'}
      </h2>
      {isLoggedIn && canUseWebAuth ? (
        <>
          <p>
            It looks like you are signed in and have passkeys. Click the button
            below to register your account.
          </p>
          {message}
          <button type="button" onClick={handleOnClick}>
            Register your passkey
          </button>
        </>
      ) : (
        <>
          <p>
            You are not signed in. We cant associate your account based on
            magic.
          </p>
          <button type="button" onClick={handleSignIn}>
            Sign in with passkeys
          </button>
        </>
      )}
    </div>
  );
}

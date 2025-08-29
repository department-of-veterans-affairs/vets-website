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

    const registrationResponse = await fetch(
      'http://localhost:3000/v0/webauthn/generate_registration_options',
    );

    let registrationData;
    try {
      registrationData = await startRegistration(
        await registrationResponse.json(),
      );
      console.log(registrationData);
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
        'http://localhost:3000/v0/webauthn/verify_registration',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(registrationData),
        },
      );

      // Wait for the results of verification
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

  const handleSignIn = async e => {
    e.preventDefault();

    const getAuthOpts = await fetch(
      `http://localhost:3000/v0/webauthn/generate_authentication_options`,
    );
    const authOptsData = await getAuthOpts.json();

    const attest = await startAuthentication(authOptsData, false);

    const verifyAuth = await fetch(
      `http://localhost:3000/v0/webauthn/verify_authnetication`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attest),
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

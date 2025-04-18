import React from 'react';
import { useLoaderData, redirect } from 'react-router-dom';
import { userPromise } from '../utilities/auth';

const AuthCallbackHandler = () => {
  useLoaderData();

  return (
    <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
      <div className="vads-l-row">
        <div className="vads-l-col--12 vads-u-padding-y--5">
          <h1>Processing your sign in</h1>
          <p>Please wait while we verify your credentials...</p>
          <va-loading-indicator message="Verifying your account..." />
        </div>
      </div>
    </div>
  );
};

// Static loader method that can be referenced in routes
AuthCallbackHandler.loader = async () => {
  // Get OAuth callback parameters
  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const to = searchParams.get('to') || '/poa-requests';

  // If we have code and state, process the OAuth callback
  if (code && state) {
    try {
      // Import the platform's auth handling utility - try with correct path
      const { handleTokenRequest } = await import('../../auth/helpers');

      localStorage.setItem('logingov_state', state);

      // Exchange the code for a token
      await handleTokenRequest({
        code,
        state,
        csp: 'logingov',
        generateOAuthError: error => {
          throw new Error(JSON.stringify(error));
        },
      });

      // After successful token exchange, redirect to the target URL
      throw redirect(to);
    } catch (error) {
      // Special handling for 302 redirects - these are normal in OAuth flows
      if (error.status === 302 || error.response?.status === 302) {
        const redirectUrl =
          error.response?.headers?.get('Location') ||
          error.headers?.get('Location');

        if (redirectUrl) {
          throw redirect(redirectUrl);
        }
      }

      // Redirect to sign-in with error and add request_id for debugging
      const errorParam = encodeURIComponent(error.message || 'auth_failed');
      const requestId = Date.now().toString(36);
      throw redirect(
        `/sign-in?error=auth_failed&code=${errorParam}&request_id=${requestId}`,
      );
    }
  }

  // Rest of the function remains the same
  if (await userPromise) {
    throw redirect(to);
  }

  return { to };
};

export default AuthCallbackHandler;

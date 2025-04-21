import React from 'react';
import { useLoaderData, redirect } from 'react-router-dom';
import { userPromise } from '../utilities/auth';

/**
 * Component to handle OAuth callback from Login.gov
 * Displays a loading state while the authentication process completes
 */
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

/**
 * Loader function for the auth callback route
 * Handles the OAuth callback from Login.gov, exchanges the code for a token,
 * and redirects to the appropriate page
 */
AuthCallbackHandler.loader = async () => {
  // Get OAuth callback parameters from URL
  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const to = searchParams.get('to') || '/poa-requests';

  // If we have code and state, process the OAuth callback
  if (code && state) {
    try {
      // Import the platform's auth handling utility
      const { handleTokenRequest } = await import('../../auth/helpers');
      const api = await import('../utilities/api');

      // Set state in localStorage for token validation
      localStorage.setItem('logingov_state', state);
      sessionStorage.setItem('serviceName', 'logingov');

      // Exchange the code for a token
      await handleTokenRequest({
        code,
        state,
        csp: 'logingov',
        generateOAuthError: error => {
          throw new Error(JSON.stringify(error));
        },
      });

      try {
        // Fetch user profile using app's API
        const response = await api.default.getUser();
        const userData = await response.json();

        // Store profile data and set authentication flag
        if (userData) {
          sessionStorage.setItem(
            'userProfile',
            JSON.stringify(userData.profile),
          );

          localStorage.setItem('hasSession', 'true');
        }
      } catch (profileError) {
        // Continue even if profile fetch fails - token is already set
        localStorage.setItem('hasSession', 'true');
      }

      window.location.replace('/representative/poa-requests');
      return null; // Return null since the page will reload
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

  // If already authenticated, redirect to target
  if (await userPromise) {
    throw redirect(to);
  }

  // Return data for component
  return { to };
};

export default AuthCallbackHandler;

import React from 'react';
import { useLoaderData, redirect } from 'react-router-dom';
import { AUTH_ERRORS } from 'platform/user/authentication/errors';
import { userPromise } from '../utilities/auth';
import manifest from '../manifest.json';

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
 * Returns the appropriate error information for a given error
 * @param {Object} error - The error object from the API
 * @returns {Object} Error information with code, title, and message
 */
const getErrorInfo = error => {
  // Default error info
  const defaultError = {
    code: 'default_error',
    title: "We couldn't sign you in",
    message:
      "We're sorry. Something went wrong with the sign-in process. Please try again.",
  };

  if (!error) return defaultError;

  try {
    // Parse the error if it's a JSON string
    const errorData =
      typeof error.message === 'string' ? JSON.parse(error.message) : error;

    // Check for specific error types and return appropriate messages
    if (
      errorData.error === 'invalid_grant' ||
      errorData.code === AUTH_ERRORS.INVALID_CREDENTIALS
    ) {
      return {
        code: 'invalid_credentials',
        title: "We couldn't verify your identity",
        message:
          "We're sorry. The credentials you provided couldn't be verified. Please try again or contact the VA Help Desk for assistance at 1-800-698-2411.",
      };
    }

    if (
      errorData.error === 'unauthorized_client' ||
      errorData.code === AUTH_ERRORS.ACCOUNT_NOT_FOUND
    ) {
      return {
        code: 'account_not_found',
        title: "We couldn't find your account",
        message:
          "We're sorry. We couldn't find an account matching your sign-in information. Make sure you're using the correct email address or username.",
      };
    }

    if (
      errorData.mfa_required ||
      errorData.error === 'mfa_required' ||
      errorData.code === AUTH_ERRORS.MULTIFACTOR_REQUIRED
    ) {
      return {
        code: 'mfa_required',
        title: 'Additional verification required',
        message:
          'For your security, we need you to complete the multi-factor authentication process. Please try signing in again.',
        status: 'warning', // Additional field to indicate this is a warning, not an error
      };
    }

    if (errorData.state_mismatch || errorData.error === 'state_mismatch') {
      return {
        code: 'state_mismatch',
        title: 'Session validation error',
        message:
          "We're having trouble signing you in due to a security validation error. Please try again or clear your browser cookies and cache.",
      };
    }
  } catch (e) {
    // If parsing fails, use the default error
  }

  return defaultError;
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
  const toParam = searchParams.get('to');
  const fallback = '/representative/dashboard';

  // Sanitize untrusted redirect target to prevent open redirects
  const sanitizeReturnPath = (untrusted, defaultPath) => {
    if (!untrusted) return defaultPath;
    try {
      // Disallow protocol-relative and external URLs
      if (/^\s*(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(untrusted)) {
        return defaultPath;
      }
      const url = new URL(untrusted, window.location.origin);
      // Require same-origin and that the path stays within this app
      if (url.origin !== window.location.origin) return defaultPath;
      if (!url.pathname.startsWith(manifest.rootUrl)) return defaultPath;
      return `${url.pathname}${url.search}${url.hash}`;
    } catch (e) {
      return defaultPath;
    }
  };

  const to = sanitizeReturnPath(toParam, fallback);

  // If we have code and state, process the OAuth callback
  if (code && state) {
    try {
      const { handleTokenRequest } = await import('../utilities/helpers');

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

      // Set hasSession flag to ensure page refreshes recognize the user is authenticated
      localStorage.setItem('hasSession', 'true');

      // Redirect to the destination computed earlier (defaults to POA requests)
      window.location.replace(to);
      return null; // Return null since the page will reload
    } catch (error) {
      // Get detailed error information
      const errorInfo = getErrorInfo(error);

      // Encode error details for URL parameters
      const errorTitle = encodeURIComponent(errorInfo.title);
      const errorMessage = encodeURIComponent(errorInfo.message);
      const errorStatus = errorInfo.status || 'error';

      // Redirect to sign-in with detailed error information
      throw redirect(
        `/sign-in?error=true&code=${
          errorInfo.code
        }&title=${errorTitle}&message=${errorMessage}&status=${errorStatus}`,
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

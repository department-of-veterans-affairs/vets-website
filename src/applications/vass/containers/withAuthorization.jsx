import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom-v5-compat';
import {
  selectUuid,
  selectHydrated,
  hydrateFormData,
  clearFormData,
  loadFormDataFromStorage,
} from '../redux/slices/formSlice';
import { getFirstTokenRoute } from '../utils/navigation';
import { AUTH_LEVELS, URLS } from '../utils/constants';
import { getVassToken, isTokenExpired, removeVassToken } from '../utils/auth';

/**
 * HOC that handles route authorization based on auth level.
 *
 * @param {React.Component} Component - The component to wrap
 * @param {'lowAuthOnly'|'token'} authLevel - The required authorization level for this route
 * @returns {React.Component} - The wrapped component with authorization logic
 */
const withAuthorization = (Component, authLevel = AUTH_LEVELS.TOKEN) => {
  return props => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = getVassToken();
    const tokenExpired = token ? isTokenExpired(token) : false;
    const hasValidToken = token && !tokenExpired;
    const uuid = useSelector(selectUuid);
    const hydrated = useSelector(selectHydrated);
    const [isHydrating, setIsHydrating] = useState(!hydrated);

    const isLowAuthOnly = authLevel === AUTH_LEVELS.LOW_AUTH_ONLY;
    const requiresToken = authLevel === AUTH_LEVELS.TOKEN;

    // Attempt to hydrate from sessionStorage on mount
    useEffect(
      () => {
        if (!hydrated) {
          const savedData = loadFormDataFromStorage();
          if (savedData) {
            dispatch(hydrateFormData(savedData));
          }
          setIsHydrating(false);
        } else {
          setIsHydrating(false);
        }
      },
      [hydrated, hasValidToken, dispatch],
    );

    // Handle lowAuthOnly routes - redirect authenticated users to first token route
    useEffect(
      () => {
        if (isHydrating) return;

        if (isLowAuthOnly && hasValidToken) {
          const firstTokenRoute = getFirstTokenRoute();
          navigate(firstTokenRoute, { replace: true });
        }
      },
      [hasValidToken, navigate, isHydrating, isLowAuthOnly],
    );

    // Handle token routes - redirect unauthenticated or expired token users to Verify page
    useEffect(
      () => {
        // Wait for hydration to complete before redirecting
        if (isHydrating) return;

        if (requiresToken && !hasValidToken) {
          // Remove expired token cookie if it exists
          if (token && tokenExpired) {
            removeVassToken();
          }

          // Clear form data when redirecting to Verify page
          dispatch(clearFormData());

          // Redirect to Verify page (root of the app)
          if (uuid) {
            navigate(`${URLS.VERIFY}?uuid=${uuid}`, {
              replace: true,
            });
          } else {
            // TODO: route to the "Something went wrong" page
          }
        }
      },
      [
        token,
        tokenExpired,
        hasValidToken,
        navigate,
        uuid,
        isHydrating,
        dispatch,
        requiresToken,
      ],
    );

    // For lowAuthOnly routes: don't render if user has valid token (they shouldn't be here)
    if (isLowAuthOnly && hasValidToken) {
      return null;
    }

    // For token routes: don't render until hydration is complete and we have a valid token
    if (requiresToken && (isHydrating || !hasValidToken)) {
      return null;
    }

    return <Component {...props} />;
  };
};

export default withAuthorization;

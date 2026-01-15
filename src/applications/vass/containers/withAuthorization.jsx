import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom-v5-compat';
import {
  selectToken,
  selectUuid,
  selectHydrated,
  hydrateFormData,
  clearFormData,
  loadFormDataFromStorage,
} from '../redux/slices/formSlice';
import { getFirstTokenRoute } from '../utils/navigation';
import { AUTH_LEVELS, URLS } from '../utils/constants';

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
    const token = useSelector(selectToken);
    const uuid = useSelector(selectUuid);
    const hydrated = useSelector(selectHydrated);
    const [isHydrating, setIsHydrating] = useState(!hydrated);

    const isLowAuthOnly = authLevel === AUTH_LEVELS.LOW_AUTH_ONLY;
    const requiresToken = authLevel === AUTH_LEVELS.TOKEN;

    // Attempt to hydrate from sessionStorage on mount
    useEffect(
      () => {
        if (!hydrated && !token) {
          const savedData = loadFormDataFromStorage();
          if (savedData) {
            dispatch(hydrateFormData(savedData));
          }
          setIsHydrating(false);
        } else {
          setIsHydrating(false);
        }
      },
      [hydrated, token, dispatch],
    );

    // Handle lowAuthOnly routes - redirect authenticated users to first token route
    useEffect(
      () => {
        if (isHydrating) return;

        if (isLowAuthOnly && token) {
          const firstTokenRoute = getFirstTokenRoute();
          navigate(firstTokenRoute, { replace: true });
        }
      },
      [token, navigate, isHydrating, isLowAuthOnly],
    );

    // Handle token routes - redirect unauthenticated users to Verify page
    useEffect(
      () => {
        // Wait for hydration to complete before redirecting
        if (isHydrating) return;

        if (requiresToken && !token) {
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
      [token, navigate, uuid, isHydrating, dispatch, requiresToken],
    );

    // For lowAuthOnly routes: don't render if user has token (they shouldn't be here)
    if (isLowAuthOnly && token) {
      return null;
    }

    // For token routes: don't render until hydration is complete and we have a token
    if (requiresToken && (isHydrating || !token)) {
      return null;
    }

    return <Component {...props} />;
  };
};

export default withAuthorization;

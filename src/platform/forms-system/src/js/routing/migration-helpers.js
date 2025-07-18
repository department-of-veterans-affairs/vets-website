import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Utility to create route redirect components from onEnter hooks
 * Converts v3 onEnter patterns to v5 useEffect + useHistory patterns
 */
export function createRouteRedirectComponent(redirectPath) {
  return function RouteRedirectComponent() {
    const history = useHistory();

    useEffect(
      () => {
        history.replace(redirectPath);
      },
      [history],
    );

    return null;
  };
}

/**
 * Utility to create route redirect components with custom logic
 * Handles more complex onEnter scenarios
 */
export function createDynamicRouteRedirectComponent(onEnterLogic) {
  return function DynamicRouteRedirectComponent() {
    const history = useHistory();
    const location = useLocation();

    useEffect(
      () => {
        if (typeof onEnterLogic === 'function') {
          const nextState = { location };
          const replace = path => history.replace(path);
          onEnterLogic(nextState, replace);
        }
      },
      [history, location],
    );

    return null;
  };
}

/**
 * Converts old indexRoute with onEnter to v5 pattern
 */
export function convertIndexRoute(onEnterFn) {
  if (typeof onEnterFn === 'function') {
    return { component: createDynamicRouteRedirectComponent(onEnterFn) };
  }
  return null;
}

/**
 * Enhanced route parameters handler for v5
 * Handles both :param and query string parameters
 */
export function withEnhancedRouteParams(Component) {
  function EnhancedRouteParamsWrapper(props) {
    const location = useLocation();
    const { match } = props;

    // Parse URL search params
    const searchParams = Object.fromEntries(
      new URLSearchParams(location.search),
    );

    // Combine route params and search params for v3 compatibility
    const enhancedLocation = {
      ...location,
      query: searchParams, // v3 style query object
    };

    // Enhanced props with both v3 and v5 patterns
    const enhancedProps = {
      ...props,
      location: enhancedLocation,
      params: match?.params || {}, // v3 style params
    };

    return <Component {...enhancedProps} />;
  }

  EnhancedRouteParamsWrapper.propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object,
    }),
  };

  return EnhancedRouteParamsWrapper;
}

/**
 * Route guard patterns for v5 - handles authentication and form validation
 */
export function createRouteGuard({
  requiresAuth = false,
  requiresForm = false,
  checkAuth,
  checkForm,
  redirectTo = '/login',
}) {
  return function RouteGuard(Component) {
    return function GuardedComponent(props) {
      const history = useHistory();
      const location = useLocation();

      useEffect(
        () => {
          if (requiresAuth && checkAuth && !checkAuth()) {
            const returnUrl = encodeURIComponent(location.pathname);
            history.replace(`${redirectTo}?returnUrl=${returnUrl}`);
            return;
          }

          if (requiresForm && checkForm && !checkForm()) {
            history.replace('/error');
          }
        },
        [history, location.pathname],
      );

      // Don't render if guards fail
      if (requiresAuth && checkAuth && !checkAuth()) {
        return null;
      }

      if (requiresForm && checkForm && !checkForm()) {
        return null;
      }

      return <Component {...props} />;
    };
  };
}

/**
 * Helper to migrate route configuration objects to v5 patterns
 */
export function migrateRouteConfig(routeConfig) {
  const migratedConfig = { ...routeConfig };

  // Convert indexRoute onEnter to component
  if (migratedConfig.indexRoute?.onEnter) {
    migratedConfig.indexRoute = convertIndexRoute(
      migratedConfig.indexRoute.onEnter,
    );
  }

  // Enhance component with route params if needed
  if (migratedConfig.component) {
    migratedConfig.component = withEnhancedRouteParams(
      migratedConfig.component,
    );
  }

  // Convert onEnter at route level
  if (migratedConfig.onEnter) {
    migratedConfig.component = createDynamicRouteRedirectComponent(
      migratedConfig.onEnter,
    );
    delete migratedConfig.onEnter;
  }

  // Recursively migrate child routes
  if (migratedConfig.childRoutes) {
    migratedConfig.childRoutes = migratedConfig.childRoutes.map(
      migrateRouteConfig,
    );
  }

  return migratedConfig;
}

/**
 * Batch migration utility for route arrays
 */
export function migrateRoutesArray(routesArray) {
  return routesArray.map(migrateRouteConfig);
}

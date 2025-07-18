import React, { useEffect } from 'react';
import {
  Route,
  Switch,
  Redirect,
  useHistory,
  useLocation,
} from 'react-router-dom';

/**
 * HOC that converts React Router v3 onEnter hook to v5 useEffect pattern
 */
export function withRouteEnterEffect(Component, onEnter) {
  return function RouteEnterEffectWrapper(props) {
    const history = useHistory();
    const location = useLocation();

    useEffect(
      () => {
        if (onEnter && typeof onEnter === 'function') {
          // Convert v3 signature to v5 pattern
          const nextState = { location };
          const replace = path => history.replace(path);
          onEnter(nextState, replace);
        }
      },
      [history, location],
    );

    return <Component {...props} />;
  };
}

/**
 * Converts v3-style route config objects to v5 Route components
 */
export function convertV3RouteToV5(routeConfig, basePath = '') {
  const {
    path,
    component,
    onEnter,
    indexRoute,
    childRoutes = [],
  } = routeConfig;
  const fullPath = basePath ? `${basePath}/${path}` : path;

  const routes = [];

  // Handle index route with onEnter
  if (indexRoute && indexRoute.onEnter) {
    const IndexComponent = () => {
      const history = useHistory();

      useEffect(
        () => {
          const nextState = { location: history.location };
          const replace = redirectPath => history.replace(redirectPath);
          indexRoute.onEnter(nextState, replace);
        },
        [history],
      );

      return null;
    };

    routes.push(
      <Route
        key={`${fullPath}-index`}
        exact
        path={fullPath}
        component={IndexComponent}
      />,
    );
  }

  // Handle main route
  if (component) {
    const WrappedComponent = onEnter
      ? withRouteEnterEffect(component, onEnter)
      : component;

    routes.push(
      <Route
        key={fullPath}
        path={fullPath}
        render={props => (
          <WrappedComponent {...props}>
            {childRoutes.map(childRoute =>
              convertV3RouteToV5(childRoute, fullPath),
            )}
          </WrappedComponent>
        )}
      />,
    );
  }

  return routes;
}

/**
 * Converts an array of v3 route objects to v5 Switch component
 */
export function convertV3RoutesToV5Switch(routesArray) {
  const allRoutes = [];

  routesArray.forEach(routeConfig => {
    allRoutes.push(...convertV3RouteToV5(routeConfig));
  });

  return (
    <Switch>
      {allRoutes}
      <Route render={() => <Redirect to="/" />} />
    </Switch>
  );
}

/**
 * Enhanced route guard HOC for v5 authentication patterns
 */
export function withRouteGuard(Component, guardConfig = {}) {
  return function RouteGuardWrapper(props) {
    const history = useHistory();
    const location = useLocation();

    const {
      requiresAuth = false,
      requiresForm = false,
      redirectTo = '/login',
      checkAuth,
      checkForm,
    } = guardConfig;

    useEffect(
      () => {
        let shouldRedirect = false;
        let redirectPath = redirectTo;

        if (requiresAuth && checkAuth && !checkAuth()) {
          shouldRedirect = true;
          redirectPath = `${redirectTo}?returnUrl=${encodeURIComponent(
            location.pathname,
          )}`;
        }

        if (requiresForm && checkForm && !checkForm()) {
          shouldRedirect = true;
        }

        if (shouldRedirect) {
          history.replace(redirectPath);
        }
      },
      [
        history,
        location.pathname,
        checkAuth,
        checkForm,
        redirectTo,
        requiresAuth,
        requiresForm,
      ],
    );

    // Render nothing while checking guards
    if (requiresAuth && checkAuth && !checkAuth()) {
      return null;
    }

    if (requiresForm && checkForm && !checkForm()) {
      return null;
    }

    return <Component {...props} />;
  };
}

/**
 * Higher-order component for handling route parameters in v5
 * Provides backward compatibility for v3 route parameter patterns
 */
export function withRouteParams(Component) {
  return function RouteParamsWrapper(props) {
    const location = useLocation();

    // Parse URL parameters for backward compatibility
    const urlParams = Object.fromEntries(new URLSearchParams(location.search));

    // Merge route params with URL params for full compatibility
    const enhancedLocation = {
      ...location,
      query: urlParams, // v3 compatibility
    };

    return <Component {...props} location={enhancedLocation} />;
  };
}

/**
 * Route configuration object to v5 component converter
 * Handles the most common v3 to v5 migration patterns
 */
export function createV5RouteFromConfig(config) {
  const {
    path,
    component: RouteComponent,
    onEnter,
    exact = false,
    permissions = {},
  } = config;

  return (
    <Route
      key={path}
      path={path}
      exact={exact}
      render={props => {
        let Component = RouteComponent;

        // Apply route guards if specified
        if (Object.keys(permissions).length > 0) {
          Component = withRouteGuard(Component, permissions);
        }

        // Apply route params compatibility
        Component = withRouteParams(Component);

        // Apply onEnter effect if specified
        if (onEnter) {
          Component = withRouteEnterEffect(Component, onEnter);
        }

        return <Component {...props} />;
      }}
    />
  );
}

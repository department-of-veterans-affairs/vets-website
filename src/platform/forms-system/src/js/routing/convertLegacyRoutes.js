import React from 'react';
import { Route, Redirect } from 'react-router-dom';

/**
 * Convert v3 plain-object route configs to v5 <Route> JSX elements.
 * Each route component receives `props.route` containing its full config
 * (matching v3 behavior where route config is spread as component props).
 *
 * Handles:
 *   { path, component }                    → <Route path render with route prop>
 *   { onEnter: (_, replace) => replace() } → <Redirect>
 *   { path: '*' }                          → <Redirect to={fallback}>
 *   { indexRoute: { component } }          → <Route exact path="/">
 *
 * @param {Array<Object>} routeConfigs - v3-style route config objects from createRoutes()
 * @param {Object} [options]
 * @param {string} [options.urlPrefix=''] - Base path prefix for all routes
 * @returns {Array<React.Element>} Array of <Route> and <Redirect> elements
 */
export function convertLegacyRoutes(routeConfigs, { urlPrefix = '' } = {}) {
  return routeConfigs
    .map((routeConfig, index) => {
      // Catch-all redirect
      if (routeConfig.path === '*') {
        return <Redirect key="catchall" to={urlPrefix || '/'} />;
      }

      // onEnter redirect (v3 pattern)
      if (routeConfig.onEnter && !routeConfig.component) {
        // Extract the redirect target by calling onEnter with a mock replace
        let redirectTo = urlPrefix || '/';
        routeConfig.onEnter({}, (path) => {
          redirectTo = path;
        });
        return (
          <Redirect
            key={`redirect-${routeConfig.path || index}`}
            from={routeConfig.path}
            to={redirectTo}
            exact
          />
        );
      }

      const RouteComponent = routeConfig.component;
      if (!RouteComponent) return null;

      // Normalize path: prefix with urlPrefix unless already absolute
      const routePath = routeConfig.path
        ? `${urlPrefix}/${routeConfig.path}`.replace(/\/+/g, '/')
        : urlPrefix || '/';

      return (
        <Route
          key={routeConfig.path || `route-${index}`}
          path={routePath}
          exact={routeConfig.path === '/' || !routeConfig.path}
          render={(routeProps) => (
            <RouteComponent {...routeProps} route={routeConfig} />
          )}
        />
      );
    })
    .filter(Boolean);
}

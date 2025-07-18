import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

/**
 * Converts React Router v3-style route configuration objects to v5 JSX routes
 * This is a migration helper to ease the transition from v3 to v5
 */
export const convertLegacyRoutesToV5 = legacyRoutes => {
  const convertSingleRoute = (route, key = 0) => {
    const {
      path,
      component: Component,
      indexRoute,
      childRoutes,
      onEnter,
      ...routeProps
    } = route;

    if (path === '*') {
      // Handle catch-all routes
      if (onEnter) {
        return (
          <Route
            key={key}
            render={({ history }) => {
              // Simulate the v3 onEnter behavior
              onEnter(null, history.replace);
              return null;
            }}
          />
        );
      }
      return <Route key={key} render={() => null} />;
    }

    return (
      <Route
        key={key}
        path={path}
        render={props => {
          // Handle onEnter hook if present
          if (onEnter) {
            // In v5, we don't have onEnter, so we handle it in the component
            // This is a simplified version - real migration might need more sophisticated handling
            try {
              onEnter(props.location, props.history.replace);
            } catch (e) {
              // Continue rendering if onEnter doesn't redirect
            }
          }

          return (
            <Component {...props} {...routeProps}>
              {/* Handle child routes */}
              {childRoutes && convertLegacyRoutesToV5(childRoutes)}
              {/* Handle index route */}
              {indexRoute &&
                indexRoute.onEnter && (
                  <Route
                    exact
                    path={path}
                    render={() => {
                      const redirect = to => <Redirect to={to} />;
                      indexRoute.onEnter(props.location, redirect);
                      return null;
                    }}
                  />
                )}
            </Component>
          );
        }}
      />
    );
  };

  if (!Array.isArray(legacyRoutes)) {
    return convertSingleRoute(legacyRoutes);
  }

  return (
    <Switch>
      {legacyRoutes.map((route, index) => convertSingleRoute(route, index))}
    </Switch>
  );
};

/**
 * Helper to create a Switch wrapper for route objects that expect to be root routes
 */
export const createV5RoutesFromLegacy = legacyRoutes => (
  <Switch>{convertLegacyRoutesToV5(legacyRoutes)}</Switch>
);

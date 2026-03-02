import React from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';

/**
 * Parse query string preserving repeated keys as arrays.
 * ?foo=1&foo=2 → { foo: ['1', '2'] }
 * ?bar=3       → { bar: '3' }
 *
 * Replaces v3's location.query which was auto-populated by the router.
 */
export function parseQuery(search) {
  const params = new URLSearchParams(search);
  const result = {};
  for (const key of new Set(params.keys())) {
    const values = params.getAll(key);
    result[key] = values.length === 1 ? values[0] : values;
  }
  return result;
}

/**
 * v5 withRouter shim providing the same prop interface as React Router v3's
 * withRouter HOC. Allows class components to remain unchanged during migration.
 *
 * Props provided:
 *   router.push(path)         → history.push(path)
 *   router.push({pathname})   → history.push({pathname}) (object form, ContactInfo)
 *   router.replace(path)      → history.replace(path)
 *   router.goBack()           → history.goBack()
 *   router.go(n)              → history.go(n)
 *   router.params             → useParams() (BackLink.jsx reads router.params)
 *   router.setRouteLeaveHook  → console.warn in dev, noop in prod
 *   location                  → useLocation() + synthesized .query and .basename
 *   params                    → useParams()
 *   route                     → forwarded from props (set by convertLegacyRoutes)
 */
export function withRouterV5Compat(WrappedComponent) {
  function WithRouterV5Compat(props) {
    const history = useHistory();
    const location = useLocation();
    const params = useParams();

    const query = parseQuery(location.search);
    const locationWithQuery = {
      ...location,
      query,
      basename: props.formConfig?.urlPrefix || props.route?.urlPrefix || '',
    };

    const router = {
      push: history.push,
      replace: history.replace,
      goBack: history.goBack,
      go: history.go,
      params,
      setRouteLeaveHook: (...args) => {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.warn(
            'setRouteLeaveHook is a no-op in v5. Use <Prompt> or history.block().',
            args,
          );
        }
      },
    };

    return (
      <WrappedComponent
        {...props}
        router={router}
        location={locationWithQuery}
        params={params}
        route={props.route}
      />
    );
  }

  WithRouterV5Compat.displayName = `withRouterV5Compat(${WrappedComponent.displayName ||
    WrappedComponent.name ||
    'Component'})`;
  WithRouterV5Compat.WrappedComponent = WrappedComponent;
  return WithRouterV5Compat;
}

import { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { focusElement } from 'platform/utilities/ui';

/**
 * MHV breadcrumb focus + routing helper.
 *
 * - Always moves focus to the first <h1> after a breadcrumb is activated
 * - Optionally wraps an existing onRouteChange handler (for apps that already
 *   do custom routing or analytics)
 *
 * Usage:
 *   const { handleRouteChange } = useBreadcrumbFocus();
 *   <VaBreadcrumbs onRouteChange={handleRouteChange} ... />
 *
 *   // or, if you already have an onRouteChange handler:
 *   const { handleRouteChange } = useBreadcrumbFocus({ onRouteChange: myHandler });
 *   <VaBreadcrumbs onRouteChange={handleRouteChange} ... />
 */
export const useBreadcrumbFocus = ({ onRouteChange } = {}) => {
  const history = useHistory();
  const location = useLocation();

  const handleRouteChange = useCallback(
    event => {
      const href = event?.detail?.href;
      if (!href) {
        return;
      }

      // If the caller supplied their own handler, let it run (e.g. analytics,
      // custom routing). Otherwise, do a simple SPA navigation with history.push.
      if (typeof onRouteChange === 'function') {
        onRouteChange(event);
      } else {
        const url = new URL(href, window.location.origin);

        const nextPath = url.pathname + url.search + url.hash;
        const currentPath = location.pathname + location.search + location.hash;

        // Avoid redundant push if it's literally the same URL, but still
        // allow focus management to run below.
        if (nextPath !== currentPath) {
          history.push(nextPath);
        }
      }

      // After navigation (or same-page click), move focus to the H1.
      // This handles:
      // - Normal breadcrumb navigation (different page)
      // - Clicking the current-page breadcrumb (same route)
      window.setTimeout(() => {
        focusElement('h1');
      }, 0);
    },
    [history, location.pathname, location.search, location.hash, onRouteChange],
  );

  return { handleRouteChange };
};

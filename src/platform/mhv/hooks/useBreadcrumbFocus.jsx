import { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { focusElement } from 'platform/utilities/ui';

const focusH1Soon = () => {
  window.setTimeout(() => {
    focusElement('h1');
  }, 0);
};

const normalizePath = value => {
  if (!value) return '';
  // normalize trailing slash (except root)
  return value.length > 1 ? value.replace(/\/+$/, '') : value;
};

const getComposedPath = event =>
  event?.composedPath?.() || event?.nativeEvent?.composedPath?.() || [];

const pathHasAriaCurrentPage = path =>
  path.some(node => node?.getAttribute?.('aria-current') === 'page');

const getHrefFromClickEvent = event => {
  const path = event?.composedPath?.() || event?.nativeEvent?.composedPath?.();
  const anchor = path?.find?.(n => n?.tagName === 'A' && n?.href);
  return anchor?.href || null;
};

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
export const useBreadcrumbFocus = (optionsOrHandler = {}) => {
  const onRouteChange =
    typeof optionsOrHandler === 'function'
      ? optionsOrHandler
      : optionsOrHandler?.onRouteChange;

  const history = useHistory();
  const location = useLocation();

  const handleRouteChange = useCallback(
    event => {
      const href = event?.detail?.href;

      // Some interactions (incl. current crumb) may not provide href; still focus.
      if (!href) {
        focusH1Soon();
        return;
      }

      if (typeof onRouteChange === 'function') {
        onRouteChange(event);
      } else {
        const url = new URL(href, window.location.origin);
        const nextPath = url.pathname + url.search + url.hash;
        const currentPath = location.pathname + location.search + location.hash;

        if (nextPath !== currentPath) {
          history.push(nextPath);
        }
      }

      focusH1Soon();
    },
    [history, location.pathname, location.search, location.hash, onRouteChange],
  );

  // Fallback for "current page" breadcrumb: no route change event
  const handleClick = useCallback(
    event => {
      const path = getComposedPath(event);

      // If the click originated from the "current page" crumb, focus H1.
      if (pathHasAriaCurrentPage(path)) {
        window.setTimeout(() => focusElement('h1'), 0);
        return;
      }

      // Otherwise, only focus when the clicked link resolves to the current URL.
      const href = getHrefFromClickEvent(event);
      if (!href) return;

      const url = new URL(href, window.location.origin);
      const clickedPath = normalizePath(url.pathname + url.search + url.hash);
      const currentPath = normalizePath(
        location.pathname + location.search + location.hash,
      );

      if (clickedPath === currentPath) {
        window.setTimeout(() => focusElement('h1'), 0);
      }
    },
    [location.pathname, location.search, location.hash],
  );

  return { handleRouteChange, handleClick };
};

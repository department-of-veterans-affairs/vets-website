import { useCallback } from 'react';
import { focusElement } from 'platform/utilities/ui';

const focusH1Soon = () => {
  window.setTimeout(() => {
    focusElement('h1');
  }, 0);
};

const normalizePath = value => {
  if (!value) return '';
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

const getCurrentPath = () =>
  normalizePath(
    `${window.location.pathname}${window.location.search}${
      window.location.hash
    }`,
  );

/**
 * MHV breadcrumb focus helper.
 *
 * - Always moves focus to the first <h1> after a breadcrumb is activated
 * - Optionally wraps an existing onRouteChange handler (for apps that already
 *   do custom routing or analytics)
 *
 * NOTE: This hook is router-agnostic by design so it can be used in apps using
 * react-router v5 and react-router-dom-v5-compat without violating hooks rules.
 */
export const useBreadcrumbFocus = (optionsOrHandler = {}) => {
  const onRouteChange =
    typeof optionsOrHandler === 'function'
      ? optionsOrHandler
      : optionsOrHandler?.onRouteChange;

  const handleRouteChange = useCallback(
    event => {
      const href = event?.detail?.href;

      if (!href) {
        focusH1Soon();
        return;
      }

      const url = new URL(href, window.location.origin);
      const nextPath = normalizePath(`${url.pathname}${url.search}${url.hash}`);
      const currentPath = getCurrentPath();

      // If the "navigation" points at the current URL, don't navigate—just focus.
      if (nextPath === currentPath) {
        focusH1Soon();
        return;
      }

      if (typeof onRouteChange === 'function') {
        onRouteChange(event);
      } else {
        window.location.assign(nextPath);
      }

      focusH1Soon();
    },
    [onRouteChange],
  );

  const handleClick = useCallback(event => {
    const path = getComposedPath(event);

    // Clicking the current crumb doesn't navigate; still move focus to H1
    if (pathHasAriaCurrentPage(path)) {
      focusH1Soon();
      return;
    }

    const href = getHrefFromClickEvent(event);
    if (!href) return;

    const url = new URL(href, window.location.origin);
    const clickedPath = normalizePath(
      `${url.pathname}${url.search}${url.hash}`,
    );
    const currentPath = getCurrentPath();

    // If user clicks a crumb that resolves to the current page, focus H1
    if (clickedPath === currentPath) {
      focusH1Soon();
    }
  }, []);

  return { handleRouteChange, handleClick };
};

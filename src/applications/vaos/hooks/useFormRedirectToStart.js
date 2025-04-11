import { useEffect, useRef } from 'react';

/**
 * Returns a boolean indicating if we should redirect a user
 * to the start of the form, because they tried to open it in the middle.
 *
 * The returned value is intended to trigger a rendering of the Redirect component,
 * which immediately redirects the user to the specified page
 *
 * After the value of shouldRedirect is returned, any subsequent calls to this hook
 * will get a false return value.
 *
 *
 * @export
 * @param {Object} hookParams The parameters for the hook
 * @param {Function} hookParams.shouldRedirect A function indicating if the app should
 *   redirect to the start of the flow. Only run once.
 * @param {boolean} [hookParams.enabled=true] A boolean indicating if we should run the redirect logic. The
 *   shouldRedirect function is not run until enabled becomes true
 * @returns {boolean} A boolean indicating if we should redirect to the start of the form
 */
export default function useFormRedirectToStart({
  shouldRedirect,
  enabled = true,
}) {
  // using a ref here to hold state that we don't need to trigger a re-render
  const hadEnabledRender = useRef(false);
  useEffect(() => {
    if (enabled) {
      hadEnabledRender.current = true;
    }
  }, [enabled]);

  if (!enabled || hadEnabledRender.current) {
    return false;
  }
  return shouldRedirect();
}

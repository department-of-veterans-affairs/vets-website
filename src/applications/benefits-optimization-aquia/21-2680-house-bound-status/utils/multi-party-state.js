/**
 * @module utils/multi-party-state
 * @description Module-level state for the multi-party feature toggle.
 *
 * The VA.gov forms system creates routes at module load time via
 * createRoutesWithSaveInProgress, so modifying formConfig props at runtime
 * doesn't affect page-level `depends` evaluation. This module provides a
 * shared state that App.jsx can write to and form.js can read from within
 * its `depends` function.
 */

let _multiPartyEnabled = false;

/**
 * Sets the multi-party feature toggle state.
 * Called from App.jsx during render so form.js `depends` reads the current
 * value in the same render pass.
 * No-op when the value is unchanged.
 * @param {boolean} value - Whether the multi-party flow is enabled
 */
export function setMultiPartyEnabled(value) {
  const nextValue = Boolean(value);
  if (_multiPartyEnabled === nextValue) return;
  _multiPartyEnabled = nextValue;
}

/**
 * Returns the current multi-party feature toggle state.
 * Used in form.js `depends` functions to conditionally show/hide pages.
 * @returns {boolean} Whether the multi-party flow is enabled
 */
export function isMultiPartyEnabled() {
  return _multiPartyEnabled;
}

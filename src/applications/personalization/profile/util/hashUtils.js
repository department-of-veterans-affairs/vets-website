/**
 * Utilities for hash-based deep linking to Contact Information edit controls.
 *
 * Why this exists:
 *  - Legacy anchors like #home-phone (#<field>) still exist; new design introduces
 *    deep links of the form #edit-home-phone to jump directly to an "Edit ..." button.
 *  - We cannot rely on hard-coded IDs for every edit button (web components may not expose
 *    predictable internal markup). We instead derive targets from the visible button labels.
 *  - Labels can change punctuation/casing; normalization makes matching resilient.
 *
 * Usage pattern:
 *  - When loading the page, read window.location.hash.
 *  - If hash starts with #edit-, attempt to focus the associated va-button via label match.
 *  - Else fall back to legacy anchor (drop leading "edit-").
 *  - If element not yet in DOM (async render), retry until found or timeout, then focus default.
 */

/**
 * Normalize a string into a slug:
 *  - lowercase
 *  - runs of non-alphanumerics replaced with single hyphen
 *  - trim leading/trailing hyphens
 *  - collapse duplicate hyphens
 */
export const toSlug = str =>
  (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/--+/g, '-');

/**
 * Given a hash like "#edit-home-phone" attempt to locate the corresponding va-button.
 * Strategy:
 *  1. If hash does not start with "#edit-" return null.
 *  2. Try direct id match (future-proof if we add id="#edit-home-phone" later).
 *  3. Iterate va-button elements with a label attribute; remove a leading "edit ",
 *     normalize remainder, compare to slug portion of hash.
 * Returns the first matching element or null.
 *
 * @param {string} hash - Location hash including leading '#'
 * @param {Document|ParentNode} root - Optional root for querying (testability)
 */
export const getEditButtonFromHash = (hash, root = document) => {
  if (typeof hash !== 'string' || !/^#edit-/.test(hash)) return null;
  const slug = hash.replace(/^#edit-/, '');

  // Direct element id match
  try {
    const direct = root.querySelector(hash);
    if (direct) return direct;
  } catch {
    // ignore malformed selectors
  }

  const buttons = Array.from(root.querySelectorAll('va-button[label]'));
  for (const btn of buttons) {
    const rawLabel = btn.getAttribute('label') || '';
    // Remove only a leading "edit " (case-insensitive)
    const labelWithoutEditPrefix = rawLabel.replace(/^edit\s+/i, '');
    const normalized = toSlug(labelWithoutEditPrefix);
    if (normalized === slug) return btn;
  }
  return null;
};

/**
 * For legacy hashes (#home-phone) and new edit hashes (#edit-home-phone),
 * transform "#edit-home-phone" -> "#home-phone" to attempt a scroll target.
 *
 * @param {string} hash
 * @param {Document|ParentNode} root
 */
export const getScrollTarget = (hash, root = document) => {
  if (typeof hash !== 'string') return null;
  const transformed = hash.replace(/^#edit-/, '#');
  try {
    return root.querySelector(transformed);
  } catch {
    return null;
  }
};

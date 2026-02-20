/**
 * Compose multiple form "depends" predicates into a single predicate that
 * returns `true` only when **all** predicates return `true`.
 *
 * This is useful for form config `depends` functions to keep conditions readable
 * and consistent:
 *
 * @example
 * const isNotDeceased = formData => !formData?.sponsorIsDeceased;
 * const hasCertifierStreet = formData => Boolean(formData?.certifierAddress?.street);
 *
 * const depends = and(isNotDeceased, hasCertifierStreet);
 * // depends(formData) === true only if both predicates pass
 *
 * @param {...(formData: any) => boolean} preds
 *   Predicate functions that accept the current `formData` and return a boolean.
 * @returns {(formData: any) => boolean}
 *   A predicate function suitable for a page `depends` property.
 */
export const whenAll = (...preds) => formData => preds.every(p => p(formData));

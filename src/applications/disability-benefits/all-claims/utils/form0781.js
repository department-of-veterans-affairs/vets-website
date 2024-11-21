// All flippers for the 0781 Papersync should be added to this file
import { isClaimingNew } from '.';

/**
 * Checks if the modern 0781 flow should be shown if the flipper is active for this veteran
 * All 0781 page-specific flippers should include a check against this top level flipper
 *
 * @returns
 *   TRUE if
 *     - is set on form via the backend
 *     - Veteran is claiming a new disability
 *     - Veteran has made prequisite choices on 'screener page'
 *   else
 *     - returns false
 */
export function showForm0781Pages(formData) {
  return (
    formData?.syncModern0781Flow === true &&
    isClaimingNew(formData) &&
    formData?.newDisabilities?.length > 0 &&
    formData?.wipn == true // [wipn8923] add check from screener page
  );
}

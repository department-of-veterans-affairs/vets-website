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
 *     - Veteran has selected connected condition choices on 'screener page'
 *   else
 *     - returns false
 */

export function showForm0781Tile(formData) {
  const conditions = formData?.mentalHealth?.conditions || {};
  return (
    formData?.syncModern0781Flow === true &&
    isClaimingNew(formData) &&
    Object.entries(conditions).some(
      ([key, value]) => key !== 'none' && value === true,
    )
  );
}

// [wipn8923] read activation state
export function showForm0781Pages(formData) {
  const conditions = formData?.mentalHealth?.conditions || {};
  return (
    formData?.syncModern0781Flow === true &&
    isClaimingNew(formData) &&
    Object.entries(conditions).some(
      ([key, value]) => key !== 'none' && value === true,
    )
  );
}


export function activate0781Flow(formData) {
  // [wipn8923] write activation state to React Store
}

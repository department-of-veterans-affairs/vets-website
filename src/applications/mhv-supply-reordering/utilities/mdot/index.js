/*
This file contains utilities to process the data received from the MDOT API.
*/

/**
 * Determines if a supply can be reordered.
 * @param {*} supply a supply
 * @returns true if the supply can be ordered, false otherwise
 */
export const isSupplyAvailable = supply => {
  if (supply?.availableForReorder && supply.nextAvailabilityDate) {
    const availDate = new Date(supply.nextAvailabilityDate);
    const now = new Date();
    return availDate <= now;
  }
  return false;
};

/**
 * Gets a list of supplies that are unavailable for reordering.
 * @param {*} mdotData the MDOT data
 * @returns an array of unavailable supplies
 */
export const getUnavailableSupplies = mdotData => {
  return mdotData?.supplies?.filter(supply => !isSupplyAvailable(supply)) || [];
};

/**
 * Gets a list of supplies that are available for reordering.
 * @param {*} mdotData the MDOT data
 * @returns an array of available supplies
 */
export const getAvailableSupplies = mdotData => {
  return mdotData?.supplies?.filter(supply => isSupplyAvailable(supply)) || [];
};

/**
 * Returns a list of supply names available for reorder
 * @param {*} mdotData mdotData
 * @returns array of supply names
 */
export const getAvailableSupplyNames = mdotData =>
  getAvailableSupplies(mdotData).map(supply => supply.name);

/**
 * Determine if the user is eligible to reorder supplies.
 * @param {*} mdotData the MDOT data
 * @returns true if the user is eligible for reordering supplies
 */
export const isEligible = mdotData => {
  const eligibility = mdotData?.eligibility;
  return !!(
    eligibility &&
    (eligibility.accessories || eligibility.apneas || eligibility.batteries)
  );
};

/**
 * Gets the next date elegibility date for when no supplies can be reordered.
 * Note that this is for when a user is not elegible to order any supplies.
 * @param {*} mdotData the MDOT data
 * @returns the next eligibility date if exists, or null if no date
 */
export const getEligibilityDate = mdotData => {
  if (
    !isEligible(mdotData) &&
    mdotData?.supplies &&
    mdotData.supplies.length > 0
  ) {
    const sortedByAvailability = mdotData.supplies
      .filter(supply => supply.availableForReorder === true)
      .sort((a, b) =>
        a.nextAvailabilityDate.localeCompare(b.nextAvailabilityDate),
      );
    return sortedByAvailability[0]?.nextAvailabilityDate || null;
  }
  return null;
};

/**
 * Get the number of available supplies that can be reordered.
 * @param {*} mdotData the MDOT data
 * @returns an integer with the number of supplies that can be reordered
 */
export const numAvailableSupplies = mdotData => {
  const availSupplies = getAvailableSupplies(mdotData);
  if (availSupplies) return availSupplies.length;
  return 0;
};

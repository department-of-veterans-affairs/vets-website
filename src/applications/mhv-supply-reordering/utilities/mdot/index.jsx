/**
 * Determines if a supply can be reordered.
 * @param {*} supply a supply
 * @returns true if the supply can be ordered, false otherwise
 */
const isSupplyAvailable = supply => {
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
  return mdotData?.supplies?.filter(supply => !isSupplyAvailable(supply));
};

/**
 * Gets a list of supplies that are available for reordering.
 * @param {*} mdotData the MDOT data
 * @returns an array of available supplies
 */
export const getAvailableSupplies = mdotData => {
  return mdotData?.supplies?.filter(supply => isSupplyAvailable(supply));
};

/**
 * Determine if the user is eligible to reorder supplies.
 * @param {*} mdotData the MDOT data
 * @returns true if the user is eligible for reordering supplies
 */
export const isEligible = mdotData => {
  const { eligibility } = mdotData;
  return (
    eligibility &&
    (eligibility.accessories || eligibility.apneas || eligibility.batteries)
  );
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

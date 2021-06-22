/**
 * Transforms a parent facility object from the VA facilities api into our
 * VAOS Location format
 *
 * @export
 * @param {VAFacility} facility A facility from the VA facilities api
 * @returns {Location} A FHIR Location resource
 */
export function transformParentFacilityV2(parentFacility) {
  return {
    resourceType: 'Location',
    id: parentFacility.id,
    vistaId: parentFacility.vista_site,
    name: parentFacility.name,

    address: {
      line: parentFacility.physical_address.line,
      city: parentFacility.physical_address.city,
      state: parentFacility.physical_address.state,
      postalCode: parentFacility.physical_address.postal_code,
    },
  };
}

/**
 * Transforms parent facilities from var-resources into Location objects
 *
 * @export
 * @param {Array<VARFacility>} parentFacilities A list of facilities from var-resources
 * @returns {Array<Location>} A list of Locations
 */
export function transformParentFacilitiesV2(facilities) {
  return facilities
    .filter(facility => {
      return facility.id === facility.vast_parent;
    })
    .map(transformParentFacilityV2);
}

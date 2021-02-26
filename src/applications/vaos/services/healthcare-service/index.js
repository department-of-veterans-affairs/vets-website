/**
 * @module services/HealthcareService
 */
import { getAvailableClinics } from '../var';
import { transformAvailableClinics } from './transformers';
import { fhirSearch, mapToFHIRErrors } from '../utils';
import { getSupportedLocationsByTypeOfCare } from '../location';

/**
 * Method to get available HealthcareService objects.
 *
 * @param {Object} params
 * @param {string} params.facilityId The VistA facility id
 * @param {string} params.typeOfCareId An id for the type of care to check for the chosen organization
 * @param {string} params.systemId The VistA 3 digit site id
 * @param {boolean} params.useVSP A flag that determines whether or not to use the new VSP apis
 *
 * @returns {Array<HealthCareService>} An a collection of HealthcareService objects.
 */
export async function getAvailableHealthcareServices({
  facilityId,
  typeOfCareId,
  systemId,
  useVSP,
}) {
  if (useVSP) {
    return fhirSearch({
      query:
        `HealthcareService?location:Location.identifier=${facilityId}` +
        '&characteristic=PATIENTDS_ENABLED',
    });
  } else {
    try {
      const clinics = await getAvailableClinics(
        facilityId,
        typeOfCareId,
        systemId,
      );

      return transformAvailableClinics(facilityId, typeOfCareId, clinics).sort(
        (a, b) =>
          a.serviceName.toUpperCase() < b.serviceName.toUpperCase() ? -1 : 1,
      );
    } catch (e) {
      if (e.errors) {
        throw mapToFHIRErrors(e.errors);
      }

      throw e;
    }
  }
}

/**
 * Fetch facility information for the facilities in the given site, based on type of care
 *
 * @export
 * @async
 * @param {Object} locationParams Parameters needed for fetching locations
 * @param {string} locationParams.siteId The VistA site id of the services being pulled
 * @param {string} locationParams.parentId An id for the parent organization of the facilities being pulled
 * @param {string} locationParams.typeOfCareId An id for the type of care to check for the chosen organization
 * @returns {Object} An object with an array of Location resources in locations and an array of HealthcareService
 *   resources in healthcareServices (only populated when useVSP is true)
 */
export async function getSupportedHealthcareServicesAndLocations({
  siteId,
  parentId,
  typeOfCareId,
  useVSP,
}) {
  let results;
  if (!useVSP) {
    results = await getSupportedLocationsByTypeOfCare({
      siteId,
      parentId,
      typeOfCareId,
    });
  } else {
    results = await fhirSearch({
      query:
        `HealthcareService?organization:Organization.identifier=${siteId}` +
        '&characteristic=PATIENTDS_ENABLED&_include=HealthcareService:location',
    });
  }

  return {
    locations: results.filter(item => item.resourceType === 'Location'),
    healthcareServices: useVSP
      ? results.filter(item => item.resourceType === 'HealthcareService')
      : null,
  };
}

/**
 * @module services/HealthcareService
 */
import { getAvailableClinics } from '../var';
import { transformAvailableClinics } from './transformers';
import { mapToFHIRErrors } from '../utils';
import { getSupportedLocationsByTypeOfCare } from '../location';

/**
 * Method to get available HealthcareService objects.
 *
 * @param {Object} params
 * @param {string} params.facilityId The VistA facility id
 * @param {string} params.typeOfCareId An id for the type of care to check for the chosen organization
 * @param {string} params.systemId The VistA 3 digit site id
 *
 * @returns {Array<HealthCareService>} An a collection of HealthcareService objects.
 */
export async function getAvailableHealthcareServices({
  facilityId,
  typeOfCareId,
  systemId,
}) {
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

/**
 * Fetch facility information for the facilities in the given site, based on type of care
 *
 * @export
 * @async
 * @param {Object} locationParams Parameters needed for fetching locations
 * @param {string} locationParams.siteId The VistA site id of the services being pulled
 * @param {string} locationParams.parentId An id for the parent organization of the facilities being pulled
 * @param {string} locationParams.typeOfCareId An id for the type of care to check for the chosen organization
 * @returns {Array<Location>} An array of Location resources
 */
export async function getSupportedHealthcareServicesAndLocations({
  siteId,
  parentId,
  typeOfCareId,
}) {
  const results = await getSupportedLocationsByTypeOfCare({
    siteId,
    parentId,
    typeOfCareId,
  });

  return results.filter(item => item.resourceType === 'Location');
}

/**
 * Method to find a particular characteristic of a clinic.
 *
 * @param {HealthCareService} clinic
 * @param {string} characteristic The characteristic to search for.
 *
 * @returns {string} The display name of the characteristic search for or an empty string.
 */
export function findCharacteristic(clinic, characteristic) {
  const result = clinic?.characteristic.find(element => {
    return element.text === characteristic;
  });

  return result?.coding?.code || result?.coding?.display;
}

function getIdentifierToken(clinic, index) {
  // The FHIR clinic identifier format is, 'urn:va:healthcareservice:983:983:308'
  // where the last 3 tokens represent the site id, facility id, and clinic id.
  return clinic?.identifier[0].value.split(':')[index];
}

/**
 * Method to get the clinic id.
 *
 * @param {HealthCareService} clinic
 * @returns {string} The clinic id or empty string.
 */
export function getClinicId(clinic) {
  return getIdentifierToken(clinic, 5);
}

/**
 * Method to get the site code.
 *
 * @param {Object} clinic
 * @returns {String} The clinic site code or empty string.
 */
export function getSiteCode(clinic) {
  return getIdentifierToken(clinic, 3);
}

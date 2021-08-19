/**
 * @module services/HealthcareService
 */
import { getAvailableClinics } from '../var';
import { transformAvailableClinics } from './transformers';
import { mapToFHIRErrors } from '../utils';
import { getSupportedLocationsByTypeOfCare } from '../location';
import { getClinics } from '../vaos';
import { transformClinicsV2 } from './transformers.v2';

/**
 * Method to get available HealthcareService objects.
 *
 * @param {Object} params
 * @param {string} params.facilityId The VistA facility id
 * @param {TypeOfCare} params.typeOfCare The type of care to check for the chosen organization
 * @param {string} params.systemId The VistA 3 digit site id
 *
 * @returns {Array<HealthCareService>} An a collection of HealthcareService objects.
 */
export async function getAvailableHealthcareServices({
  facilityId,
  typeOfCare,
  systemId,
  useV2 = false,
}) {
  try {
    let clinics = null;
    if (useV2) {
      const clinicData = await getClinics({
        locationId: facilityId,
        typeOfCareId: typeOfCare.idV2,
      });
      clinics = transformClinicsV2(clinicData);
    } else {
      const clinicData = await getAvailableClinics(
        facilityId,
        typeOfCare.id,
        systemId,
      );
      clinics = transformAvailableClinics(
        facilityId,
        typeOfCare.id,
        clinicData,
      );
    }

    return clinics.sort(
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
 * Fetches a single clinic based on the id provided from the v2 endpoints
 *
 * @export
 * @param {Object} params
 * @param {string} params.locationId The location or facility id of the clinic
 * @param {string} params.id The clinic id
 */
export async function fetchHealthcareServiceById({ locationId, id }) {
  try {
    const results = await getClinics({
      locationId,
      clinicIds: [id],
    });

    return transformClinicsV2(results)[0];
  } catch (e) {
    if (e.errors) {
      throw mapToFHIRErrors(e.errors);
    }

    throw e;
  }
}

/**
 * Method to get the clinic id.
 *
 * @param {HealthCareService} clinic
 * @returns {string} The clinic id or empty string.
 */
export function getClinicId(clinic) {
  return clinic.id.split('_')[1];
}

/**
 * Method to get the site code.
 *
 * @param {Object} clinic
 * @returns {String} The clinic site code or empty string.
 */
export function getSiteCode(clinic) {
  return clinic.id.split('_')[0];
}

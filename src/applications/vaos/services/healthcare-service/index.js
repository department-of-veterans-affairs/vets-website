/**
 * @module services/HealthcareService
 */
import { mapToFHIRErrors } from '../utils';
import { getClinics } from '../vaos';
import { transformClinicsV2 } from './transformers';

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
}) {
  try {
    let clinics = null;
    const clinicData = await getClinics({
      locationId: facilityId,
      typeOfCareId: typeOfCare.idV2,
    });
    clinics = transformClinicsV2(clinicData);

    return clinics.sort((a, b) =>
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

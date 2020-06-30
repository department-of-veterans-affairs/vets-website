import { getAvailableClinics } from '../../api';
import { transformAvailableClinics } from './transformers';
import { mapToFHIRErrors } from '../../utils/fhir';
import { getLocation } from '../location';

/*
 * This is used to parse the fake FHIR ids we create for organizations
 */
function parseId(id) {
  return id.replace('var', '');
}

/**
 * Method to get available HealthcareService objects.
 *
 * @param {String} facilityId
 * @param {String} typeOfCareId
 * @param {String} systemId
 *
 * @returns {Array} An a collection of HealthcareService objects.
 */
export async function getAvailableHealthcareServices({
  facilityId,
  typeOfCareId,
  systemId,
}) {
  try {
    const clinics = await getAvailableClinics(
      parseId(facilityId),
      typeOfCareId,
      systemId,
    );

    return transformAvailableClinics(
      parseId(facilityId),
      typeOfCareId,
      clinics,
    ).sort(
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

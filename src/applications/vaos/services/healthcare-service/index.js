import { getAvailableClinics } from '../../api';
import { transformAvailableClinics } from './transformers';
import { fhirSearch, mapToFHIRErrors } from '../utils';
import { getSupportedLocationsByTypeOfCare } from '../location';

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

/**
 * Fetch facility information for the facilities in the given site, based on type of care
 *
 * @export
 * @param {Object} locationsParams Parameters needed for fetching locations
 * @param {Array} locationParams.siteId The VistA site id of the services being pulled
 * @param {Array} locationParams.parentId An id for the parent organization of the facilities being pulled
 * @param {Array} locationParams.typeOfCareId An id for the type of care to check for the chosen organization
 * @returns {Object} A FHIR searchset of Location resources
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
      mock: () =>
        siteId === '983'
          ? import('./mock_locations_983.json')
          : import('./mock_locations_984.json'),
    });
  }

  return {
    locations: results.filter(item => item.resourceType === 'Location'),
    healthcareServices: useVSP
      ? results.filter(item => item.resourceType === 'HealthcareService')
      : null,
  };
}

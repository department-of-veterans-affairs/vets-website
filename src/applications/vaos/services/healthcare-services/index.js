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

export async function getAvailableHealthCareSystems(
  facilityId,
  typeOfCareId,
  systemId,
) {
  try {
    const clinics = await getAvailableClinics(
      parseId(facilityId),
      typeOfCareId,
      systemId,
    );

    return transformAvailableClinics(parseId(facilityId), clinics);
  } catch (e) {
    if (e.errors) {
      throw mapToFHIRErrors(e.errors);
    }

    throw e;
  }
}

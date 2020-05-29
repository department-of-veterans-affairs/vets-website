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

    // const location = await getLocation({facilityId: facilityId});
    const location = {
      id: '1',
      hoursOfOperation: {
        daysOfWeek: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
        allDay: true,
        availableStartTime: '',
        availableEndTime: '',
      },
    };

    return transformAvailableClinics(parseId(facilityId), location, clinics);
  } catch (e) {
    if (e.errors) {
      throw mapToFHIRErrors(e.errors);
    }

    throw e;
  }
}

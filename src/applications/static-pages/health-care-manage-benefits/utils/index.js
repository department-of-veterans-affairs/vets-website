// Node modules.
import { isEmpty, intersection } from 'lodash';

export const hasFacilityException = (facilityIDs, facilityIDExceptions) => {
  // Derive the facility exceptions that were found.
  const facilityExceptionsFound = intersection(facilityIDs, facilityIDExceptions);

  // Return false if there are none.
  if (isEmpty(facilityExceptionsFound)) {
    return false;
  }

  // Return true if there are some.
return true;
}

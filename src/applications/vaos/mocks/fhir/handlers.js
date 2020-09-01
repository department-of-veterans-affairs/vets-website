/* istanbul ignore file */
import healthcareService983 from './mock_healthcare_system_983.json';
import healthcareService984 from './mock_healthcare_system_984.json';
import locations983 from './mock_locations_983.json';
import locations984 from './mock_locations_984.json';
import organization from './mock_organizations.json';
import slots from './mock_slots.json';
import { generateMockFHIRSlots } from '../../utils/calendar';

/*
 * Handler definition:
 *
 * path: Can be a string or a regex. Strings match from the end of a url
 * delay: Value in ms to delay the response by
 * response: Can be a json object or a function
 * 
 * response function params:
 * url: the full url of the request
 * options.requestData: Parsed body data
 * options.groups: Any matched regex groups from the url
 */
export default [
  {
    path: /vaos.*HealthcareService.*Location.identifier=983/,
    response: healthcareService983,
  },
  {
    path: /vaos.*HealthcareService.*Location.identifier=984/,
    response: healthcareService984,
  },
  {
    path: /vaos.*HealthcareService.*Organization.identifier=983/,
    response: locations983,
  },
  {
    path: /vaos.*HealthcareService.*Organization.identifier=984/,
    response: locations984,
  },
  {
    path: /vaos.*\/Organization\?/,
    response: organization,
  },
  {
    path: /vaos.*\/Slot\?/,
    response: () => ({ ...slots, entry: generateMockFHIRSlots() }),
  },
];

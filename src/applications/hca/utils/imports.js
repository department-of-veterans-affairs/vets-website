import FULL_SCHEMA from 'vets-json-schema/dist/10-10EZ-schema.json';
import SCHEMA_CONSTANTS from 'vets-json-schema/dist/constants.json';

// destruct vets-json-schema constants
const STATES_USA = SCHEMA_CONSTANTS.states.USA;
const STATES_50_AND_DC = SCHEMA_CONSTANTS.states50AndDC;

export {
  VaCheckbox,
  VaModal,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/contacts';

export { FULL_SCHEMA, STATES_50_AND_DC, STATES_USA };

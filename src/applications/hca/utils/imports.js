import FULL_SCHEMA from 'vets-json-schema/dist/10-10EZ-schema.json';
import SCHEMA_CONSTANTS from 'vets-json-schema/dist/constants.json';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import {
  VaCheckbox,
  VaModal,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

// destruct vets-json-schema constansts
const STATES_USA = SCHEMA_CONSTANTS.states.USA;
const STATES_50_AND_DC = SCHEMA_CONSTANTS.states50AndDC;

// construct React web component bindings
const REACT_BINDINGS = {
  VaCheckbox,
  VaModal,
  VaSelect,
};

export { CONTACTS, FULL_SCHEMA, REACT_BINDINGS, STATES_50_AND_DC, STATES_USA };

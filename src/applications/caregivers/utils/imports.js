import FULL_SCHEMA from 'vets-json-schema/dist/10-10CG-schema.json';
import SCHEMA_CONSTANTS from 'vets-json-schema/dist/constants.json';
import CAREGIVER_FACILITIES from 'vets-json-schema/dist/caregiverProgramFacilities.json';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import {
  VaCheckbox,
  VaRadio,
  VaRadioOption,
  VaSearchInput,
  VaSelect,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export const STATES_USA = SCHEMA_CONSTANTS.states.USA;

export const REACT_BINDINGS = {
  VaCheckbox,
  VaRadio,
  VaRadioOption,
  VaSearchInput,
  VaSelect,
  VaTextInput,
};

export { CONTACTS, FULL_SCHEMA, CAREGIVER_FACILITIES };

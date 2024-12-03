import FULL_SCHEMA from 'vets-json-schema/dist/10-10EZ-schema.json';
import {
  states,
  states50AndDC as STATES_50_AND_DC,
} from 'vets-json-schema/dist/constants.json';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import REACT_BINDINGS from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const STATES_USA = states.USA;

export { CONTACTS, FULL_SCHEMA, REACT_BINDINGS, STATES_50_AND_DC, STATES_USA };

import {
  addressSchema,
  radioSchema,
  radioUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { nameWording, privWrapper } from '../../../shared/utilities';
import { addressWithValidationUI } from '../../definitions';

const TITLE_TEXT = 'mailing address';
const DESC_TEXT =
  'We’ll send any important information about this form to this address.';

const LABEL_STREET3 = 'Apartment or unit number';
const LABEL_MILITARY =
  'Address is on a U.S. military base outside of the United States.';
const ADDRESS_INPUT_LABEL =
  'Has the beneficiary’s mailing address changed since their last CHAMPVA form submission?';
const ADDRESS_HINT_TEXT =
  'If yes, we will update our records with the new mailing address.';

const SCHEMA_LABELS = {
  yes: 'Yes',
  no: 'No',
  unknown: 'I’m not sure',
};
const SCHEMA_ENUM = Object.keys(SCHEMA_LABELS);

const PAGE_TITLE = ({ formData }) =>
  privWrapper(
    `${nameWording(formData, undefined, undefined, true)} ${TITLE_TEXT}`,
  );

export default {
  uiSchema: {
    ...titleUI(PAGE_TITLE, DESC_TEXT),
    applicantAddress: addressWithValidationUI({
      labels: {
        street3: LABEL_STREET3,
        militaryCheckbox: LABEL_MILITARY,
      },
    }),
    applicantNewAddress: radioUI({
      title: ADDRESS_INPUT_LABEL,
      hint: ADDRESS_HINT_TEXT,
      labels: SCHEMA_LABELS,
    }),
  },
  schema: {
    type: 'object',
    required: ['applicantNewAddress'],
    properties: {
      applicantAddress: addressSchema(),
      applicantNewAddress: radioSchema(SCHEMA_ENUM),
    },
  },
};

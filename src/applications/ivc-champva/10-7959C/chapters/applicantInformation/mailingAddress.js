import {
  addressSchema,
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { addressWithValidationUI } from '../../definitions';
import { titleWithNameUI } from '../../utils/titles';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['applicant--address-title'];
const DESC_TEXT = content['applicant--address-description'];

const LABEL_STREET3 = content['applicant--address-label--street3'];
const LABEL_MILITARY = content['applicant--address-label--military'];

const ADDRESS_INPUT_LABEL = content['applicant--address-change-label'];
const ADDRESS_HINT_TEXT = content['applicant--address-change-hint'];

const SCHEMA_LABELS = {
  yes: content['form--option--yes'],
  no: content['form--option--no'],
  unknown: content['form--option--unsure'],
};
const SCHEMA_ENUM = Object.keys(SCHEMA_LABELS);

export default {
  uiSchema: {
    ...titleWithNameUI(TITLE_TEXT, DESC_TEXT),
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

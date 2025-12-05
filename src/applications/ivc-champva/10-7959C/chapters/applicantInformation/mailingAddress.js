import {
  addressSchema,
  addressUI,
  radioSchema,
  radioUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { nameWording, privWrapper } from '../../../shared/utilities';
import { validAddressCharsOnly } from '../../../shared/validations';

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

const PAGE_TITLE = ({ formData }) =>
  privWrapper(
    `${nameWording(formData, undefined, undefined, true)} ${TITLE_TEXT}`,
  );

export default {
  uiSchema: {
    ...titleUI(PAGE_TITLE, DESC_TEXT),
    applicantAddress: addressUI({
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
    'ui:validations': [
      (errors, formData) =>
        validAddressCharsOnly(errors, null, formData, 'applicantAddress'),
    ],
  },
  schema: {
    type: 'object',
    required: ['applicantNewAddress'],
    properties: {
      applicantAddress: addressSchema(),
      applicantNewAddress: radioSchema(Object.keys(SCHEMA_LABELS)),
    },
  },
};

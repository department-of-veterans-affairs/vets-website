import {
  descriptionUI,
  radioSchema,
  radioUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import PaymentSelectionDescription from '../../components/FormDescriptions/PaymentSelectionDescription';

const TITLE_TEXT = 'Who should we send payments to?';
const INPUT_LABEL = 'Send payment to:';

const SCHEMA_ENUM = ['Veteran', 'Provider'];
const SCHEMA_LABELS = Object.fromEntries(SCHEMA_ENUM.map(key => [key, key]));

export default {
  uiSchema: {
    ...titleUI(TITLE_TEXT),
    ...descriptionUI(PaymentSelectionDescription),
    sendPayment: radioUI({ title: INPUT_LABEL, labels: SCHEMA_LABELS }),
  },
  schema: {
    type: 'object',
    required: ['sendPayment'],
    properties: {
      sendPayment: radioSchema(SCHEMA_ENUM),
    },
  },
};

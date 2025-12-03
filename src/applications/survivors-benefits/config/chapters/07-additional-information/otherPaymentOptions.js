import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { DirectDepositOtherOptions, usingDirectDeposit } from './helpers';

const notUsingDirectDeposit = formData => !usingDirectDeposit(formData);

export default {
  title: 'Other payment options',
  path: 'additional-information/other-payment-options',
  initialData: {},
  depends: notUsingDirectDeposit,
  uiSchema: {
    ...titleUI('Other payment options', DirectDepositOtherOptions),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

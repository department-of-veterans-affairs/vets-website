import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { DirectDepositOtherOptions } from '../../../helpers';
import { usingDirectDeposit } from './helper';

const otherPaymentOptions = {
  title: 'Other payment options',
  path: 'additional-information/other-payment-options',
  initialData: {},
  depends: formData => !usingDirectDeposit(formData),
  uiSchema: {
    ...titleUI('Other payment options', DirectDepositOtherOptions),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

export { otherPaymentOptions };

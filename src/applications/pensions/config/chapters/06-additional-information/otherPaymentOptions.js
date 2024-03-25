import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { DirectDepositOtherOptions } from '../../../helpers';

const otherPaymentOptions = {
  uiSchema: {
    ...titleUI('Other payment options', DirectDepositOtherOptions),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

export { otherPaymentOptions };

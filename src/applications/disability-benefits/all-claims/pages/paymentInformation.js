import { fetchPaymentInformation } from '../utils';
import AsyncDisplayWidget from '../components/AsyncDisplayWidget';
import PaymentView from '../components/PaymentView';
import PaymentFailureView from '../components/PaymentFailureView';

export const uiSchema = {
  'ui:title': 'Payment information',
  'ui:field': 'StringField',
  'ui:widget': AsyncDisplayWidget,
  'ui:options': {
    callback: fetchPaymentInformation,
    viewComponent: PaymentView,
    failureComponent: PaymentFailureView,
  },
};

export const schema = {
  type: 'object',
  properties: {},
};

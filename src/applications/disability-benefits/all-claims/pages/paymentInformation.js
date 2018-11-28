import fullSchema from '../config/schema';
import { bankFieldsHaveInput } from '../utils';
import ReviewCardField from '../components/ReviewCardField';
import PaymentView from '../components/PaymentView';

const {
  bankAccountType,
  bankAccountNumber,
  bankRoutingNumber,
  bankName,
} = fullSchema.properties;

export const uiSchema = {
  'view:bankAccount': {
    'ui:title': 'Payment Information',
    'ui:description':
      'We’re currently paying your compensation to this account',
    'ui:field': ReviewCardField,
    'ui:options': {
      viewComponent: PaymentView,
      reviewTitle: 'Payment information',
      editTitle: 'Add new bank account',
      itemName: 'account',
      startInEdit: formData =>
        Object.keys(formData).every(key => !formData[key]),
      volatileData: true,
    },
    bankAccountType: {
      'ui:title': 'Account type',
      'ui:options': {
        widgetClassNames: 'va-select-medium-large',
      },
      'ui:required': bankFieldsHaveInput,
    },
    bankAccountNumber: {
      'ui:title': 'Account number',
      'ui:options': {
        widgetClassNames: 'va-input-medium-large',
      },
      'ui:required': bankFieldsHaveInput,
    },
    bankRoutingNumber: {
      'ui:title': 'Routing number',
      'ui:errorMessages': {
        pattern: 'Routing number must be 9 digits',
      },
      'ui:options': {
        widgetClassNames: 'va-input-medium-large',
      },
      'ui:required': bankFieldsHaveInput,
    },
    bankName: {
      'ui:title': 'Bank name',
      'ui:required': bankFieldsHaveInput,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:bankAccount': {
      type: 'object',
      properties: {
        bankAccountType,
        bankAccountNumber,
        bankRoutingNumber,
        bankName,
      },
    },
  },
};

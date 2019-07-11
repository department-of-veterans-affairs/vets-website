import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
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
    'ui:description': 'We’ll pay your disability benefit to the account below.',
    'ui:field': ReviewCardField,
    'ui:options': {
      viewComponent: PaymentView,
      reviewTitle: 'Payment information',
      editTitle: 'Add new bank account',
      itemName: 'account',
      startInEdit: formData => !formData['view:hasPrefilledBank'],
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

import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import ReviewCardField from 'platform/forms-system/src/js/components/ReviewCardField';
import {
  selectUI,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { bankFieldsHaveInput } from '../utils';
import PaymentView from '../components/PaymentView';
import PaymentViewObjectField from '../components/PaymentViewObjectField';
import {
  addAccountAlert,
  paymentInformationTitle,
} from '../content/paymentInformation';
import ConfirmationPaymentInformation from '../components/confirmationFields/ConfirmationPaymentInformation';

const {
  bankAccountType,
  bankAccountNumber,
  bankRoutingNumber,
  bankName,
} = fullSchema.properties;

export const uiSchema = {
  'ui:objectViewField': PaymentViewObjectField,
  'view:bankAccount': {
    'ui:title': paymentInformationTitle,
    'ui:field': ReviewCardField,
    'ui:options': {
      viewComponent: PaymentView,
      reviewTitle: 'Payment information',
      editTitle: 'Add new bank account',
      // Force ObjectField to wrap the account info in a `div` instead of a `dl`
      // otherwise this breaks the axe check on the review page
      customTitle: ' ',
      itemName: 'account',
      startInEdit: formData => !formData['view:hasPrefilledBank'],
      volatileData: true,
    },
    'view:newAccountAlert': {
      'ui:description': addAccountAlert,
    },
    bankAccountType: selectUI({
      title: 'Account type',
      labels: {
        Checking: 'Checking',
        Savings: 'Savings',
      },
      required: bankFieldsHaveInput,
    }),
    bankAccountNumber: textUI({
      title: 'Account number',
      required: bankFieldsHaveInput,
    }),
    bankRoutingNumber: textUI({
      title: 'Routing number',
      required: bankFieldsHaveInput,
      errorMessages: {
        pattern: 'Routing number must be 9 digits',
      },
    }),
    bankName: textUI({
      title: 'Bank name',
      required: bankFieldsHaveInput,
    }),
  },
  'ui:confirmationField': ConfirmationPaymentInformation,
};

export const schema = {
  type: 'object',
  properties: {
    'view:bankAccount': {
      type: 'object',
      properties: {
        'view:newAccountAlert': {
          type: 'object',
          properties: {},
        },
        bankAccountType,
        bankAccountNumber,
        bankRoutingNumber,
        bankName,
      },
    },
  },
};

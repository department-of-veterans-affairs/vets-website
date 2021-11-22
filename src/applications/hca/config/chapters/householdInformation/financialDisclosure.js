import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';

import { disclosureWarning, financialDisclosureText } from '../../../helpers';

const { discloseFinancialInformation } = fullSchemaHca.properties;

const emptyObjectSchema = {
  type: 'object',
  properties: {},
};

export default {
  uiSchema: {
    'ui:title': 'Financial disclosure',
    'ui:description': financialDisclosureText,
    discloseFinancialInformation: {
      'ui:title': 'Do you want to provide your financial information?',
      'ui:widget': 'yesNo',
    },
    'view:noDiscloseWarning': {
      'ui:description': disclosureWarning,
      'ui:options': {
        hideIf: form => form.discloseFinancialInformation !== false,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['discloseFinancialInformation'],
    properties: {
      discloseFinancialInformation,
      'view:noDiscloseWarning': emptyObjectSchema,
    },
  },
};

import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';

import { FinancialDisclosureDescription } from '../../../components/FormDescriptions';
import { FinancialDisclosureAlert } from '../../../components/FormAlerts';
import { emptyObjectSchema } from '../../../definitions';

const { discloseFinancialInformation } = fullSchemaHca.properties;

export default {
  uiSchema: {
    'ui:title': 'Financial disclosure',
    'ui:description': FinancialDisclosureDescription,
    discloseFinancialInformation: {
      'ui:title': 'Do you want to provide your financial information?',
      'ui:widget': 'yesNo',
    },
    'view:noDiscloseWarning': {
      'ui:description': FinancialDisclosureAlert,
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

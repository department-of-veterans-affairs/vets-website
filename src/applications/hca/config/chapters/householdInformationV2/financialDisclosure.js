import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import { FinancialDisclosureV2Description } from '../../../components/FormDescriptions';

const { discloseFinancialInformation } = fullSchemaHca.properties;

export default {
  uiSchema: {
    'ui:title': 'Financial disclosure',
    'ui:description': FinancialDisclosureV2Description,
    discloseFinancialInformation: {
      'ui:title': 'Do you want to provide your financial information?',
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    required: ['discloseFinancialInformation'],
    properties: {
      discloseFinancialInformation,
    },
  },
};

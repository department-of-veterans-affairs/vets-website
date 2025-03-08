import { FULL_SCHEMA } from '../../../utils/imports';

const { discloseFinancialInformation } = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    discloseFinancialInformation: {
      'ui:title': 'Do you want to share your household financial information?',
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

import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import { SpouseFinancialSupportDescription } from '../../../components/FormDescriptions';

const { provideSupportLastYear } = fullSchemaHca.properties;
const date = new Date();

export default {
  uiSchema: {
    'ui:title': 'Spouse\u2019s financial support',
    provideSupportLastYear: {
      'ui:title': `Did you provide financial support to your spouse in ${date.getFullYear() -
        1} even though you didn\u2019t live together?`,
      'ui:description': SpouseFinancialSupportDescription,
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    properties: {
      provideSupportLastYear,
    },
  },
};

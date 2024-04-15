import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import { LAST_YEAR } from '../../../utils/constants';
import { SpouseFinancialSupportDescription } from '../../../components/FormDescriptions';

const { provideSupportLastYear } = fullSchemaHca.properties;

export default {
  uiSchema: {
    'ui:title': 'Spouse\u2019s financial support',
    provideSupportLastYear: {
      'ui:title': `Did you provide financial support to your spouse in ${LAST_YEAR} even though you didn\u2019t live together?`,
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

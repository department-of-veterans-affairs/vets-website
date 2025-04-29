import { LAST_YEAR } from '../../../utils/helpers';
import { FULL_SCHEMA } from '../../../utils/imports';
import {
  SpouseAdditionalInformationDescription,
  SpouseAdditionalInformationTitle,
} from '../../../components/FormDescriptions';

const { cohabitedLastYear, sameAddress } = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    'ui:title': SpouseAdditionalInformationTitle,
    'ui:description': SpouseAdditionalInformationDescription,
    cohabitedLastYear: {
      'ui:title': `Did you live with your spouse for all or part of ${LAST_YEAR}?`,
      'ui:widget': 'yesNo',
    },
    sameAddress: {
      'ui:title': 'Do you currently have the same address as your spouse?',
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    required: ['sameAddress'],
    properties: {
      cohabitedLastYear,
      sameAddress,
    },
  },
};

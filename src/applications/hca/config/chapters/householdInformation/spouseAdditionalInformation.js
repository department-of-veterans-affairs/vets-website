import {
  titleUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { LAST_YEAR, replaceStrValues } from '../../../utils/helpers';
import { FULL_SCHEMA } from '../../../utils/imports';
import { SpouseAdditionalInformationDescription } from '../../../components/FormDescriptions';
import content from '../../../locales/en/content.json';

const { cohabitedLastYear, sameAddress } = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    ...titleUI(content['household-info--spouse-addtl-info-title']),
    ...descriptionUI(SpouseAdditionalInformationDescription),
    cohabitedLastYear: {
      'ui:title': replaceStrValues(
        content['household-info--spouse-addtl-info-cohabitate-label'],
        LAST_YEAR,
      ),
      'ui:widget': 'yesNo',
    },
    sameAddress: {
      'ui:title': content['household-info--spouse-addtl-info-address-label'],
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

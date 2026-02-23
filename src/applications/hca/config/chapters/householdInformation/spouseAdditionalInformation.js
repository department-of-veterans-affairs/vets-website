// @ts-check
import {
  titleUI,
  descriptionUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { LAST_YEAR, replaceStrValues } from '../../../utils/helpers';
import { SpouseAdditionalInformationDescription } from '../../../components/FormDescriptions';
import content from '../../../locales/en/content.json';

export default {
  uiSchema: {
    ...titleUI(content['household-info--spouse-addtl-info-title']),
    ...descriptionUI(SpouseAdditionalInformationDescription),
    cohabitedLastYear: yesNoUI({
      title: replaceStrValues(
        content['household-info--spouse-addtl-info-cohabitate-label'],
        LAST_YEAR,
      ),
    }),
    sameAddress: yesNoUI({
      title: content['household-info--spouse-addtl-info-address-label'],
    }),
  },
  schema: {
    type: 'object',
    required: ['sameAddress'],
    properties: {
      cohabitedLastYear: yesNoSchema,
      sameAddress: yesNoSchema,
    },
  },
};

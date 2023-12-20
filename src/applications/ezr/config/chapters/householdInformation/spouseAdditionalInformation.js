import {
  titleUI,
  descriptionUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import SpouseInfoDescription from '../../../components/FormDescriptions/SpouseInfoDescription';
import { replaceStrValues } from '../../../utils/helpers/general';
import { LAST_YEAR } from '../../../utils/constants';
import content from '../../../locales/en/content.json';

export default {
  uiSchema: {
    ...titleUI(content['household-spouse-addtl-info-title']),
    ...descriptionUI(SpouseInfoDescription, {
      hideOnReview: true,
    }),
    cohabitedLastYear: yesNoUI(
      replaceStrValues(content['household-spouse-cohabitate-label'], LAST_YEAR),
    ),
    sameAddress: yesNoUI(content['household-spouse-same-address-label']),
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

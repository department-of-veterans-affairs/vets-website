import {
  yesNoUI,
  yesNoSchema,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import DependentSupportDescription from '../../../components/FormDescriptions/DependentSupportDescription';
import { replaceStrValues } from '../../../utils/helpers/general';
import { LAST_YEAR } from '../../../utils/constants';
import content from '../../../locales/en/content.json';

export default {
  uiSchema: {
    ...descriptionUI(DependentSupportDescription, {
      hideOnReview: true,
    }),
    receivedSupportLastYear: yesNoUI(
      replaceStrValues(
        content['household-dependent-received-support-label'],
        LAST_YEAR,
      ),
    ),
  },
  schema: {
    type: 'object',
    properties: {
      receivedSupportLastYear: yesNoSchema,
    },
  },
};

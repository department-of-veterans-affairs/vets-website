import { yesNoSchema } from 'platform/forms-system/src/js/web-component-patterns';
import DependentSupportDescription from '../../../components/FormDescriptions/DependentSupportDescription';
import { replaceStrValues } from '../../../utils/helpers/general';
import { LAST_YEAR } from '../../../utils/constants';
import content from '../../../locales/en/content.json';

export default {
  uiSchema: {
    receivedSupportLastYear: {
      'ui:title': replaceStrValues(
        content['household-dependent-received-support-label'],
        LAST_YEAR,
      ),
      'ui:description': DependentSupportDescription,
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    properties: {
      receivedSupportLastYear: yesNoSchema,
    },
  },
};

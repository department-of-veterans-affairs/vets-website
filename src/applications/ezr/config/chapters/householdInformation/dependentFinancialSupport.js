import { yesNoSchema } from 'platform/forms-system/src/js/web-component-patterns';
import DependentSupportDescription from '../../../components/FormDescriptions/DependentSupportDescription';
import { replaceStrValues } from '../../../utils/helpers/general';
import content from '../../../locales/en/content.json';

const date = new Date();
const lastYear = date.getFullYear() - 1;

export default {
  uiSchema: {
    receivedSupportLastYear: {
      'ui:title': replaceStrValues(
        content['household-dependent-received-support-label'],
        lastYear,
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

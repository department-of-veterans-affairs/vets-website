import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
import {
  yesNoUI,
  yesNoSchema,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { VIEW_FIELD_SCHEMA } from '../../../utils/constants';
import content from '../../../locales/en/content.json';

export default {
  uiSchema: {
    ...descriptionUI(PrefillMessage, { hideOnReview: true }),
    'view:medicareDescription': descriptionUI(
      content['insurance-medicare-description'],
      { hideOnReview: true },
    ),
    isEnrolledMedicarePartA: yesNoUI(content['insurance-medicare-title']),
  },
  schema: {
    type: 'object',
    required: ['isEnrolledMedicarePartA'],
    properties: {
      'view:medicareDescription': VIEW_FIELD_SCHEMA,
      isEnrolledMedicarePartA: yesNoSchema,
    },
  },
};

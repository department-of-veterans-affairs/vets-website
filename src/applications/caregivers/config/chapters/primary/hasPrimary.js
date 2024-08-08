import { merge } from 'lodash';
import {
  yesNoUI,
  yesNoSchema,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import PrimaryCaregiverIntro from '../../../components/FormDescriptions/PrimaryCaregiverIntro';
import CustomYesNoReviewField from '../../../components/FormReview/CustomYesNoReviewField';
import content from '../../../locales/en/content.json';

const hasPrimaryCaregiver = {
  uiSchema: {
    ...descriptionUI(PrimaryCaregiverIntro),
    'view:hasPrimaryCaregiver': merge(
      {},
      yesNoUI({
        title: content['primary-apply-label'],
      }),
      { 'ui:reviewField': CustomYesNoReviewField },
    ),
  },
  schema: {
    type: 'object',
    required: ['view:hasPrimaryCaregiver'],
    properties: {
      'view:hasPrimaryCaregiver': yesNoSchema,
    },
  },
};

export default hasPrimaryCaregiver;

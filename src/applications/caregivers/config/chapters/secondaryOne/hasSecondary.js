import { merge } from 'lodash';
import {
  yesNoUI,
  yesNoSchema,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { hasPrimaryCaregiver } from '../../../utils/helpers';
import { validateCaregivers } from '../../../utils/validation';
import { SecondayCaregiverOneIntro } from '../../../components/FormDescriptions/SecondayCaregiverIntros';
import CustomYesNoReviewField from '../../../components/FormReview/CustomYesNoReviewField';
import content from '../../../locales/en/content.json';

const hasSecondaryCaregiverOne = {
  uiSchema: {
    ...descriptionUI(SecondayCaregiverOneIntro),
    'view:hasSecondaryCaregiverOne': merge(
      {},
      yesNoUI({
        title: content['secondary-one-apply-label'],
        required: hasPrimaryCaregiver,
      }),
      {
        'ui:reviewField': CustomYesNoReviewField,
        'ui:validations': [validateCaregivers],
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasSecondaryCaregiverOne': yesNoSchema,
    },
  },
};

export default hasSecondaryCaregiverOne;

import { merge } from 'lodash';
import {
  yesNoUI,
  yesNoSchema,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  hasPrimaryCaregiver,
  hideCaregiverRequiredAlert,
} from '../../../utils/helpers';
import { validateCaregivers } from '../../../utils/validation';
import { emptySchema } from '../../../definitions/sharedSchema';
import { SecondayCaregiverOneIntro } from '../../../components/FormDescriptions/SecondayCaregiverIntros';
import CustomYesNoReviewField from '../../../components/FormReview/CustomYesNoReviewField';
import SecondaryRequiredAlert from '../../../components/FormAlerts/SecondaryRequiredAlert';
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
    'view:caregiverRequiredAlert': {
      'ui:description': SecondaryRequiredAlert,
      'ui:options': {
        hideIf: hideCaregiverRequiredAlert,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasSecondaryCaregiverOne': yesNoSchema,
      'view:caregiverRequiredAlert': emptySchema,
    },
  },
};

export default hasSecondaryCaregiverOne;

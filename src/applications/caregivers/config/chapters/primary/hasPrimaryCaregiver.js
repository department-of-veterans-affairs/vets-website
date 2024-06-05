import { primaryCaregiverFields } from '../../../definitions/constants';
import CustomYesNoReviewField from '../../../components/FormReview/CustomYesNoReviewField';
import PrimaryCaregiverDescription from '../../../components/FormDescriptions/PrimaryCaregiverDescription';

const hasPrimaryCaregiverPage = {
  uiSchema: {
    [primaryCaregiverFields.hasPrimaryCaregiver]: {
      'ui:title':
        'Would you like to apply for benefits for a Primary Family Caregiver?',
      'ui:description': PrimaryCaregiverDescription({
        additionalInfo: true,
      }),
      'ui:reviewField': CustomYesNoReviewField,
      'ui:widget': 'yesNo',
      'ui:required': () => true,
    },
  },
  schema: {
    type: 'object',
    properties: {
      [primaryCaregiverFields.hasPrimaryCaregiver]: {
        type: 'boolean',
      },
    },
  },
};

export default hasPrimaryCaregiverPage;

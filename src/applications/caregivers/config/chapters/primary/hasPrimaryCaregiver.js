import { primaryCaregiverFields } from '../../../definitions/constants';
import PrimaryCaregiverDescription from '../../../components/FormDescriptions/PrimaryCaregiverDescription';

const hasPrimaryCaregiverPage = {
  uiSchema: {
    [primaryCaregiverFields.hasPrimaryCaregiver]: {
      'ui:title':
        'Would you like to apply for benefits for a Primary Family Caregiver?',
      'ui:required': () => true,
      'ui:description': PrimaryCaregiverDescription({
        additionalInfo: true,
      }),
      'ui:widget': 'yesNo',
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

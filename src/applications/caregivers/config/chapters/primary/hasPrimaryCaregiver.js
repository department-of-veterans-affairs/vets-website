import { primaryCaregiverFields } from 'applications/caregivers/definitions/constants';
import PrimaryCaregiverDescription from 'applications/caregivers/components/FormDescriptions/PrimaryCaregiverDescription';

const hasSecondaryCaregiverPage = {
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

export default hasSecondaryCaregiverPage;

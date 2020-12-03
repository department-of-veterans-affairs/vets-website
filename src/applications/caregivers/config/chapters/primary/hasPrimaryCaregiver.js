import { primaryCaregiverFields } from 'applications/caregivers/definitions/constants';
import { PrimaryCaregiverInfo } from 'applications/caregivers/components/AdditionalInfo';

const hasSecondaryCaregiverPage = {
  uiSchema: {
    [primaryCaregiverFields.hasPrimaryCaregiver]: {
      'ui:title': 'Would you like to add a Primary Family Caregiver?',
      'ui:required': () => true,
      'ui:description': PrimaryCaregiverInfo({
        additionalInfo: true,
        headerInfo: false,
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

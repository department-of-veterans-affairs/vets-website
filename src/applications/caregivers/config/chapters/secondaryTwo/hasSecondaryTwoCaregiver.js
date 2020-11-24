import { secondaryCaregiverFields } from 'applications/caregivers/definitions/constants';
import { SecondaryCaregiverInfo } from 'applications/caregivers/components/AdditionalInfo';

const hasSecondaryTwoCaregiverPage = {
  uiSchema: {
    [secondaryCaregiverFields.secondaryTwo.hasSecondaryCaregiverTwo]: {
      'ui:title': 'Would you like to add another Secondary Family Caregiver?',
      'ui:description': SecondaryCaregiverInfo({
        additionalInfo: true,
        headerInfo: false,
      }),
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    properties: {
      [secondaryCaregiverFields.secondaryTwo.hasSecondaryCaregiverTwo]: {
        type: 'boolean',
      },
    },
  },
};

export default hasSecondaryTwoCaregiverPage;

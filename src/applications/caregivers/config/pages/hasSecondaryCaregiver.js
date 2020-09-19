import { SecondaryCaregiverInfo } from 'applications/caregivers/components/AdditionalInfo';
import { primaryCaregiverFields } from 'applications/caregivers/definitions/constants';
import definitions from 'applications/caregivers/definitions/caregiverUI';

const { hasSecondaryCaregiverOneUI } = definitions.sharedItems;

const hasSecondaryCaregiverPage = {
  uiSchema: {
    'ui:description': SecondaryCaregiverInfo({
      additionalInfo: true,
      headerInfo: false,
    }),
    [primaryCaregiverFields.hasSecondaryCaregiverOneView]: hasSecondaryCaregiverOneUI,
  },
  schema: {
    type: 'object',
    properties: {
      [primaryCaregiverFields.hasSecondaryCaregiverOneView]: {
        type: 'boolean',
      },
    },
  },
};

export default hasSecondaryCaregiverPage;

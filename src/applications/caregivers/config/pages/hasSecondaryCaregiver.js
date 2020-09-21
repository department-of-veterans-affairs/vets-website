import { primaryCaregiverFields } from 'applications/caregivers/definitions/constants';
import definitions from 'applications/caregivers/definitions/caregiverUI';

const { hasSecondaryCaregiverOneUI } = definitions.sharedItems;

const hasSecondaryCaregiverPage = {
  uiSchema: {
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

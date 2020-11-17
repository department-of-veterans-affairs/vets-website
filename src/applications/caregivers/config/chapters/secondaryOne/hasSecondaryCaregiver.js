import { primaryCaregiverFields } from 'applications/caregivers/definitions/constants';
import definitions from 'applications/caregivers/definitions/caregiverUI';

const {
  hasSecondaryCaregiverOneUI,
  secondaryRequiredAlert,
} = definitions.sharedItems;

const hasSecondaryCaregiverPage = {
  uiSchema: {
    [primaryCaregiverFields.hasSecondaryCaregiverOne]: hasSecondaryCaregiverOneUI,
    'view:secondaryAlert': secondaryRequiredAlert,
  },
  schema: {
    type: 'object',
    properties: {
      [primaryCaregiverFields.hasSecondaryCaregiverOne]: {
        type: 'boolean',
      },
      'view:secondaryAlert': {
        type: 'boolean',
      },
    },
  },
};

export default hasSecondaryCaregiverPage;

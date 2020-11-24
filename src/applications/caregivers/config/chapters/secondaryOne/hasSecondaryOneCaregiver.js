import definitions from 'applications/caregivers/definitions/caregiverUI';
import { secondaryCaregiverFields } from 'applications/caregivers/definitions/constants';
import { SecondaryRequiredAlert } from 'applications/caregivers/components/AdditionalInfo';
import { shouldHideAlert } from 'applications/caregivers/helpers';

const { hasSecondaryCaregiverOneUI } = definitions.sharedItems;

const hasSecondaryOneCaregiverPage = {
  uiSchema: {
    [secondaryCaregiverFields.secondaryOne
      .hasSecondaryCaregiverOne]: hasSecondaryCaregiverOneUI,
    'view:secondaryAlert': {
      'ui:title': ' ',
      'ui:widget': SecondaryRequiredAlert,
      'ui:options': {
        hideIf: formData => shouldHideAlert(formData),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      [secondaryCaregiverFields.secondaryOne.hasSecondaryCaregiverOne]: {
        type: 'boolean',
      },
      'view:secondaryAlert': {
        type: 'boolean',
      },
    },
  },
};

export default hasSecondaryOneCaregiverPage;

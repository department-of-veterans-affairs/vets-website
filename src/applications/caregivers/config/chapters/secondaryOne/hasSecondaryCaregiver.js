import { secondaryRequiredAlert } from 'applications/caregivers/definitions/UIDefinitions/caregiverUI';
import { primaryCaregiverFields } from 'applications/caregivers/definitions/constants';
import SecondaryCaregiverDescription from 'applications/caregivers/components/FormDescriptions/SecondaryCaregiverDescription';

const hasSecondaryCaregiverPage = {
  uiSchema: {
    [primaryCaregiverFields.hasSecondaryCaregiverOne]: {
      'ui:title':
        'Would you like to apply for benefits for a Secondary Family Caregiver?',
      'ui:widget': 'yesNo',
      'ui:description': SecondaryCaregiverDescription({
        additionalInfo: true,
      }),
      'ui:required': formData =>
        !formData[primaryCaregiverFields.hasPrimaryCaregiver],
      'ui:validations': [
        {
          validator: (errors, _fieldData, formData) => {
            const hasPrimary =
              formData[primaryCaregiverFields.hasPrimaryCaregiver];
            const hasSecondary =
              formData[primaryCaregiverFields.hasSecondaryCaregiverOne];
            const hasCaregiver = hasPrimary || hasSecondary;

            // add a blank error to disable the ability to continue the form while not displaying the error itself
            if (!hasCaregiver) {
              errors.addError(' ');
            }
          },
        },
      ],
    },
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

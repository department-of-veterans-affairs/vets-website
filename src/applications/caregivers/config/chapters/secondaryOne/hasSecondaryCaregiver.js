import { secondaryRequiredAlert } from 'applications/caregivers/definitions/UIDefinitions/caregiverUI';
import { primaryCaregiverFields } from 'applications/caregivers/definitions/constants';
import { SecondaryCaregiverInfo } from 'applications/caregivers/components/AdditionalInfo';

const hasSecondaryCaregiverPage = {
  uiSchema: {
    [primaryCaregiverFields.hasSecondaryCaregiverOne]: {
      'ui:title': 'Would you like to add a Secondary Family Caregiver?',
      'ui:widget': 'yesNo',
      'ui:description': SecondaryCaregiverInfo({
        additionalInfo: true,
        headerInfo: false,
      }),
      'ui:required': formData =>
        !formData[primaryCaregiverFields.hasPrimaryCaregiver],
      'ui:validations': [
        {
          validator: (errors, fieldData, formData) => {
            const hasPrimary =
              formData[primaryCaregiverFields.hasPrimaryCaregiver];
            const hasSecondary =
              formData[primaryCaregiverFields.hasSecondaryCaregiverOne];
            const hasCaregiver = hasPrimary || hasSecondary;

            if (!hasCaregiver) {
              // We are adding a blank error to disable the ability to continue the form but not displaying the error text its self
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

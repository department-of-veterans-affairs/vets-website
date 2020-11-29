import definitions from 'applications/caregivers/definitions/caregiverUI';
import {
  primaryCaregiverFields,
  secondaryCaregiverFields,
} from 'applications/caregivers/definitions/constants';
import { SecondaryCaregiverInfo } from 'applications/caregivers/components/AdditionalInfo';

const { secondaryRequiredAlert } = definitions.sharedItems;

const hasSecondaryCaregiverPage = {
  uiSchema: {
    [secondaryCaregiverFields.secondaryOne.hasSecondaryCaregiverOne]: {
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
              formData[
                secondaryCaregiverFields.secondaryOne.hasSecondaryCaregiverOne
              ];
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
      [secondaryCaregiverFields.secondaryOne.hasSecondaryCaregiverOne]: {
        type: 'boolean',
      },
      'view:secondaryAlert': {
        type: 'boolean',
      },
    },
  },
};

export default hasSecondaryCaregiverPage;

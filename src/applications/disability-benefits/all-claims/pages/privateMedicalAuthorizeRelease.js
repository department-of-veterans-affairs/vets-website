import { AUTHORIZATION_LABEL } from '../components/Authorization';

export const uiSchema = {
  patient4142Acknowledgement: {
    'ui:title':
      'I authorize the release of my non-VA medical records to the VA',
    'ui:validations': [
      (errors, fieldData) => {
        if (!fieldData) {
          errors.addError(
            'You must authorize the release of your non-VA medical records to continue.',
          );
        }
      },
    ],
    'ui:confirmationField': value => {
      return {
        data: value.formData ? 'Yes' : 'No',
        label: AUTHORIZATION_LABEL,
      };
    },
  },
};

export const schema = {
  type: 'object',
  required: ['patient4142Acknowledgement'],
  properties: {
    patient4142Acknowledgement: {
      type: 'boolean',
      default: false,
    },
  },
};

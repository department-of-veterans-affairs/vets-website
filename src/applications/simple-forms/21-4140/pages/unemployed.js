// @ts-check
import {
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    unemploymentCertifications: {
      ...checkboxGroupUI({
        title: 'Do you certify that you have no employment to report?',
        labelHeaderLevel: '1', // Makes title serve as page heading
        required: true,
        hint: 'You must select both statements to submit this form',
        labels: {
          unemploymentCertification:
            'I certify that I have not been employed by the VA, other employers or self-employed during the past twelve months.',
          accuracyCertification:
            'I further certify that the items completed on this form are true and correct to the best of my knowledge and belief. I believe that my service-connected disability(ies) has not improved and continues to prevent me from securing or following gainful employment.',
        },
        errorMessages: {
          atLeastOne: 'You must check both certifications to continue',
          required: 'You must check both certifications to continue',
        },
      }),
      // Override the default validation to require BOTH checkboxes
      'ui:validations': [
        (errors, fieldData) => {
          if (!fieldData) {
            errors.addError('You must check both certifications to continue');
            return;
          }

          const {
            unemploymentCertification,
            accuracyCertification,
          } = fieldData;

          if (!unemploymentCertification || !accuracyCertification) {
            errors.addError('You must check both certifications to continue');
          }
        },
      ],
    },
  },
  schema: {
    type: 'object',
    properties: {
      unemploymentCertifications: checkboxGroupSchema([
        'unemploymentCertification',
        'accuracyCertification',
      ]),
    },
    required: ['unemploymentCertifications'],
  },
};

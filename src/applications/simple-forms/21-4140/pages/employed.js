// @ts-check
import {
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    employmentCertifications: {
      ...checkboxGroupUI({
        title: 'Do you certify that you have employment to report?',
        labelHeaderLevel: '1', // Makes title serve as page heading
        required: true,
        hint: 'You must select both statements to submit this form',
        labels: {
          employmentCertification:
            'I certify that I have been employed by the VA, other employers or self-employed during the past twelve months.',
          employmentAccuracyCertification:
            'I understand that my continued entitlement to VA unemployability compensation benefits will be based on information that I have furnished on this form or that I hereafter may be required to furnish VA.',
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

          const { employmentCertification, employmentAccuracyCertification } =
            fieldData;

          if (!employmentCertification || !employmentAccuracyCertification) {
            errors.addError('You must check both certifications to continue');
          }
        },
      ],
    },
  },
  schema: {
    type: 'object',
    properties: {
      employmentCertifications: checkboxGroupSchema([
        'employmentCertification',
        'employmentAccuracyCertification',
      ]),
    },
    required: ['employmentCertifications'],
  },
};

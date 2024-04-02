import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  hasMedicalTreatmentTitle,
  hasMedicalTreatmentTitleErrorMessage,
  hasMedicalTreatmentTitleNoLabel,
  hasMedicalTreatmentTitleYesLabel,
} from '../config/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'view:hasReceivedMedicalTreatment': yesNoUI({
      labelHeaderLevel: 3,
      updateUiSchema: formData => ({
        'ui:title': hasMedicalTreatmentTitle(formData),
        'ui:options': {
          labels: {
            Y: hasMedicalTreatmentTitleYesLabel(formData),
            N: hasMedicalTreatmentTitleNoLabel(formData),
          },
        },
        'ui:errorMessages': {
          required: hasMedicalTreatmentTitleErrorMessage(formData),
        },
      }),
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasReceivedMedicalTreatment': yesNoSchema,
    },
    required: ['view:hasReceivedMedicalTreatment'],
  },
};

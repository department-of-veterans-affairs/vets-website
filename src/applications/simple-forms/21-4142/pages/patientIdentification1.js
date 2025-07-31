import {
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { patientIdentificationFields } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    [patientIdentificationFields.parentObject]: {
      ...titleUI({
        title: 'Records identification',
      }),
      [patientIdentificationFields.isRequestingOwnMedicalRecords]: yesNoUI({
        title: 'Whose medical records are you authorizing the release of?',
        labels: {
          Y: "The Veteran's",
          N: 'Someone else connected to the Veteran',
        },
        errorMessages: {
          required:
            "Select whose medical records you're authorizing the release of.",
        },
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      [patientIdentificationFields.parentObject]: {
        type: 'object',
        required: [patientIdentificationFields.isRequestingOwnMedicalRecords],
        properties: {
          [patientIdentificationFields.isRequestingOwnMedicalRecords]: yesNoSchema,
        },
      },
    },
  },
};

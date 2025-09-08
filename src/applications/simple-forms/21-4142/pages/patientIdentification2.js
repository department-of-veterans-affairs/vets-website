import {
  titleUI,
  fullNameUI,
  vaFileNumberUI,
  ssnUI,
  fullNameSchema,
  ssnSchema,
  vaFileNumberSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { patientIdentificationFields } from '../definitions/constants';
import { getFullNameLabels } from '../helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    [patientIdentificationFields.parentObject]: {
      ...titleUI({
        title:
          "Tell us about the person whose records you're authorizing the release of",
      }),
      [patientIdentificationFields.patientFullName]: fullNameUI(label =>
        getFullNameLabels(label, true),
      ),
      [patientIdentificationFields.patientSsn]: ssnUI('Social Security number'),
      [patientIdentificationFields.patientVaFileNumber]: vaFileNumberUI(
        'VA file number (if applicable)',
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      [patientIdentificationFields.parentObject]: {
        type: 'object',
        required: ['patientFullName', 'patientSsn'],
        properties: {
          [patientIdentificationFields.patientFullName]: fullNameSchema,
          [patientIdentificationFields.patientSsn]: ssnSchema,
          [patientIdentificationFields.patientVaFileNumber]: vaFileNumberSchema,
        },
      },
    },
  },
};

import { merge } from 'lodash/fp';
import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';

import {
  medicarePartADescription,
  medicaidDescription,
} from '../../../helpers';

const {
  medicarePartAEffectiveDate,
  isEnrolledMedicarePartA,
  isMedicaidEligible,
} = fullSchemaHca.properties;

export default {
  uiSchema: {
    isMedicaidEligible: {
      'ui:title': 'Are you eligible for Medicaid?',
      'ui:description': medicaidDescription,
      'ui:widget': 'yesNo',
    },
    isEnrolledMedicarePartA: {
      'ui:title': 'Are you enrolled in Medicare Part A (hospital insurance)?',
      'ui:description': medicarePartADescription,
      'ui:widget': 'yesNo',
    },
    medicarePartAEffectiveDate: merge(
      currentOrPastDateUI('What is your Medicare Part A effective date?'),
      {
        'ui:required': formData => formData.isEnrolledMedicarePartA,
        'ui:options': {
          expandUnder: 'isEnrolledMedicarePartA',
        },
      },
    ),
  },
  schema: {
    type: 'object',
    required: ['isMedicaidEligible', 'isEnrolledMedicarePartA'],
    properties: {
      isMedicaidEligible,
      isEnrolledMedicarePartA,
      medicarePartAEffectiveDate,
    },
  },
};

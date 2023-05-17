import React from 'react';
import dateUI from 'platform/forms-system/src/js/definitions/date';
import * as address from 'platform/forms-system/src/js/definitions/address';
import fullSchema from 'vets-json-schema/dist/21-4142-schema.json';

import { convertToDateField } from 'platform/forms-system/src/js/validation';
import { isValidDateRange } from 'platform/forms-system/src/js/utilities/validations';
import {
  patientIdentificationFields,
  providerFacilityFields,
} from '../definitions/constants';

import RecordField from '../components/RecordField';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:description': (
      <div className="vads-u-margin-bottom--4">
        Let us know where and when treatment was received. We'll request the
        private medical records for you.
      </div>
    ),
    'ui:options': {
      updateSchema: formData => {
        let patientId = 'patient';
        if (
          formData[patientIdentificationFields.parentObject][
            patientIdentificationFields.isRequestingOwnMedicalRecords
          ]
        )
          patientId = 'Veteran';
        const title = (
          <h3 className="vads-u-color--gray-dark">
            Where did the {patientId} receive treatment?
          </h3>
        );
        return { title };
      },
    },
    [providerFacilityFields.parentObject]: {
      'ui:options': {
        itemName: 'Treatment record',
        viewField: RecordField,
        keepInPageOnReview: true,
        useDlWrap: true,
        customTitle: ' ',
      },
      items: {
        'ui:order': [
          providerFacilityFields.providerFacilityName,
          providerFacilityFields.providerFacilityAddress,
          providerFacilityFields.conditionsTreated,
          providerFacilityFields.treatmentDateRange,
        ],
        [providerFacilityFields.providerFacilityName]: {
          'ui:title': 'Name of private provider or hospital',
          'ui:required': () => true,
          'ui:errorMessages': {
            required:
              'Please provide the name of the private provider or hospital',
          },
        },
        [providerFacilityFields.providerFacilityAddress]: address.uiSchema(
          null,
          false,
          () => true,
        ),
        [providerFacilityFields.conditionsTreated]: {
          'ui:title':
            'List the conditions the patient was treated for at this facility',
          'ui:widget': 'textarea',
          'ui:required': () => true,
          'ui:errorMessages': {
            required: 'Please list at least one condition',
          },
        },
        [providerFacilityFields.treatmentDateRange]: {
          from: dateUI('First treatment date (you can estimate)'),
          to: dateUI('Last treatment date (you can estimate)'),
        },
        'ui:validations': [
          (errors, field) => {
            const treatmentDateFrom =
              field[providerFacilityFields.treatmentDateRange].from;
            const treatmentDateTo =
              field[providerFacilityFields.treatmentDateRange].to;
            const fromDate = convertToDateField(treatmentDateFrom);
            const toDate = convertToDateField(treatmentDateTo);

            if (!isValidDateRange(fromDate, toDate, true)) {
              errors[providerFacilityFields.treatmentDateRange].to.addError(
                'The end date must be after the start date',
              );
            }
          },
        ],
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      [providerFacilityFields.parentObject]: {
        type: 'array',
        minItems: 1,
        maxItems: 5,
        items: {
          ...fullSchema.properties[providerFacilityFields.parentObject].items,
          properties: {
            ...fullSchema.properties[providerFacilityFields.parentObject].items
              .properties,
            [providerFacilityFields.providerFacilityAddress]: address.schema(
              fullSchema,
              () => true,
            ),
          },
        },
      },
    },
  },
};

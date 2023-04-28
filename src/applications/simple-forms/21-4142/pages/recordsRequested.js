import React from 'react';
import dateUI from 'platform/forms-system/src/js/definitions/date';
import * as address from 'platform/forms-system/src/js/definitions/address';
import fullSchema from 'vets-json-schema/dist/21-4142-schema.json';
import { providerFacilityFields } from '../definitions/constants';

import RecordField from '../components/RecordField';
import { RecordReviewField } from '../components/RecordReviewField';

const addressUiSchema = address.uiSchema(null, false, () => true);
const { country, street, street2, city, state, postalCode } = addressUiSchema;
const countryReviewPattern = {
  ...country,
  'ui:reviewField': RecordReviewField,
};
const streetReviewPattern = {
  ...street,
  'ui:reviewField': RecordReviewField,
};
const street2ReviewPattern = {
  ...street2,
  'ui:reviewField': RecordReviewField,
};
const cityReviewPattern = {
  ...city,
  'ui:reviewField': RecordReviewField,
};
const stateReviewPattern = {
  ...state,
  'ui:reviewField': RecordReviewField,
};
const postalCodeReviewPattern = {
  ...postalCode,
  'ui:reviewField': RecordReviewField,
};

export default {
  uiSchema: {
    'ui:title': (
      <h3 className="vads-u-color--gray-dark">
        Where did you receive treatment?
      </h3>
    ),
    'ui:description': (
      <div className="vads-u-margin-bottom--4">
        Let us know where and when treatment was received. We'll request the
        private medical records for you.
      </div>
    ),
    [providerFacilityFields.parentObject]: {
      'ui:options': {
        viewField: RecordField,
        keepInPageOnReview: true,
        // Added to make h5 in review list go away – see ReadOnlyArrayField.jsx
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
          'ui:reviewField': RecordReviewField,
        },
        [providerFacilityFields.providerFacilityAddress]: {
          ...addressUiSchema,
          country: countryReviewPattern,
          street: streetReviewPattern,
          street2: street2ReviewPattern,
          city: cityReviewPattern,
          state: stateReviewPattern,
          postalCode: postalCodeReviewPattern,
          // ...address.uiSchema(null, false, () => true),
          // 'ui:reviewField': RecordReviewField,
        },
        [providerFacilityFields.conditionsTreated]: {
          'ui:title':
            'List the conditions the patient was treated for at this facility',
          'ui:widget': 'textarea',
          'ui:reviewField': RecordReviewField,
        },
        [providerFacilityFields.treatmentDateRange]: {
          from: {
            ...dateUI('First treatment date (you can estimate)'),
            'ui:reviewField': RecordReviewField,
          },
          to: {
            ...dateUI('Last treatment date (you can estimate)'),
            'ui:reviewField': RecordReviewField,
          },
        },
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

import React from 'react';
import { intersection, pick } from 'lodash';

import fullSchema from 'vets-json-schema/dist/26-4555-schema.json';
import {
  addressNoMilitarySchema,
  addressNoMilitaryUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import { livingSituationFields } from '../definitions/constants';

const { required, properties } = fullSchema.properties[
  livingSituationFields.parentObject
];
const pageFields = [
  livingSituationFields.careFacilityName,
  // livingSituationFields.careFacilityAddress,
  // omitted because unused, will be restored when vets-json-schema is changed
];

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Facility details',
      'Tell us more about the nursing home or medical care facility you live in',
    ),
    [livingSituationFields.parentObject]: {
      [livingSituationFields.careFacilityName]: {
        'ui:title': 'Facility name',
        'ui:webComponentField': VaTextInputField,
      },
      [livingSituationFields.careFacilityAddress]: {
        'ui:title': (
          <h4 className="vads-u-margin-bottom--neg1 vads-u-color--gray-dark vads-u-margin-top--4">
            Facility address
          </h4>
        ),
        ...addressNoMilitaryUI({
          omit: ['street3'],
          required: false,
        }),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      [livingSituationFields.parentObject]: {
        type: 'object',
        required: intersection(required, pageFields),
        properties: {
          ...pick(properties, pageFields),
          [livingSituationFields.careFacilityAddress]: addressNoMilitarySchema({
            omit: ['street3'],
          }),
        },
      },
    },
  },
};

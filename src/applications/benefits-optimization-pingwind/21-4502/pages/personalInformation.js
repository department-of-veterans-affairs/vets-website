import React from 'react';
import { cloneDeep } from 'lodash';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import {
  ssnUI,
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameUI,
  fullNameSchema,
  titleUI,
  ssnSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaDateField from 'platform/forms-system/src/js/web-component-fields/VaDateField';
import { veteranFields } from '../definitions/constants';

const veteranFullNameUI = cloneDeep(fullNameUI());
veteranFullNameUI.middle['ui:title'] = 'Middle initial';

const veteranFullNameSchema = cloneDeep(fullNameSchema);
if (veteranFullNameSchema?.properties?.middle) {
  veteranFullNameSchema.properties.middle.maxLength = 1;
}

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Section I: Veteran identification information'),
    'ui:description': (
      <div>
        <VaAlert status="info" class="vads-u-margin-top--3" uswds visible>
          <h2 slot="headline">
            <b>What we need:</b>
          </h2>
          <div className="vads-u-margin--0">
            <ul style={{ marginBottom: 0 }}>
              <li>Your full name</li>
              <li>Date of birth</li>
              <li>Social Security Number</li>
              <li>VA file number (if you have one)</li>
              <li>Veteran service number (if you have one)</li>
            </ul>
          </div>
        </VaAlert>
      </div>
    ),
    [veteranFields.parentObject]: {
      'ui:description': (
        <div className="vads-u-margin-top--8">
          <h2 style={{ marginTop: 0 }}>Basic information</h2>
        </div>
      ),
      [veteranFields.fullName]: veteranFullNameUI,
      [veteranFields.dateOfBirth]: {
        ...dateOfBirthUI({ hint: 'For example: January 19, 2022' }),
        'ui:webComponentField': VaDateField,
      },
      [veteranFields.ssn]: ssnUI(),
      [veteranFields.vaFileNumber]: {
        'ui:title': 'VA file number (optional)',
        'ui:options': {
          hideEmptyValueInReview: true,
        },
      },
      [veteranFields.veteranServiceNumber]: {
        'ui:title': 'Veteran service number (optional)',
        'ui:options': {
          hideEmptyValueInReview: true,
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      [veteranFields.parentObject]: {
        type: 'object',
        properties: {
          [veteranFields.fullName]: veteranFullNameSchema,
          [veteranFields.dateOfBirth]: dateOfBirthSchema,
          [veteranFields.ssn]: ssnSchema,
          [veteranFields.vaFileNumber]: { type: 'string', maxLength: 20 },
          [veteranFields.veteranServiceNumber]: {
            type: 'string',
            maxLength: 20,
          },
        },
        required: [
          veteranFields.fullName,
          veteranFields.dateOfBirth,
          veteranFields.ssn,
        ],
      },
    },
  },
};

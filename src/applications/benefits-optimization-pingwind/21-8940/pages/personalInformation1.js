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
} from '~/platform/forms-system/src/js/web-component-patterns';
import VaDateField from '~/platform/forms-system/src/js/web-component-fields/VaDateField';
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
    ...titleUI('Section I: Veteran ID and Information'),
    'ui:description': (
      <div>
        <VaAlert status="info" class="vads-u-margin-top--3" uswds visible>
          <h2 slot="headline">
            <b>What to expect:</b>
          </h2>
          <div className="vads-u-margin--0">
            <ul style={{ marginBottom: 0 }}>
              <li>Veteran's Name</li>
              <li>Date of Birth</li>
              <li>Social Security Number</li>
              <li>Veteran's Service Number</li>
              <li>
                Contact Information (mailing address, email address, phone
                number)
              </li>
              <li>VA File Number</li>
              <li>Takes about 5-7 minutes</li>
            </ul>
          </div>
        </VaAlert>
      </div>
    ),

    [veteranFields.parentObject]: {
      'ui:description': (
        <div className="vads-u-margin-top--8">
          <h2 style={{ marginTop: 0 }}>Basic Information:</h2>
          <p>We need to collect some basic information about you first.</p>
        </div>
      ),
      //
      [veteranFields.fullName]: veteranFullNameUI,
      [veteranFields.dateOfBirth]: {
        ...dateOfBirthUI({
          hint: 'For example: January 19 2022',
        }),
        'ui:webComponentField': VaDateField,
      },
      [veteranFields.ssn]: ssnUI(),
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

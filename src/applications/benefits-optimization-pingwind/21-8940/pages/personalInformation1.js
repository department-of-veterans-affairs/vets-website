import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import {
  ssnUI,
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameUI,
  fullNameSchema,
  ssnSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import VaDateField from '~/platform/forms-system/src/js/web-component-fields/VaDateField';
import { veteranFields } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:description': (
      <div>
        <h3 style={{ marginTop: 0 }}>Section I: Veteran ID and Information</h3>
        <VaAlert status="info" class="vads-u-margin-top--3" uswds visible>
          <h4 slot="headline">
            <b>What to expect:</b>
          </h4>
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
          <h4 style={{ marginTop: 0 }}>Basic Information:</h4>
          <p>We need to collect some basic information about you first.</p>
        </div>
      ),
      //
      [veteranFields.fullName]: fullNameUI(),
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
          [veteranFields.fullName]: fullNameSchema,
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

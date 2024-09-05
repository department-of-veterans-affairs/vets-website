import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { formatDateLong } from 'platform/utilities/date';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Personal information'),
    'ui:description':
      'This is the personal information we have on file for you.',
    fullName: {
      'ui:title': 'Personal Information',
      'ui:field': ({ formData }) => (
        <div className="vads-l-row">
          <div className="vads-l-col--12 vads-u-padding-left--2 vads-u-padding-y--0 vads-u-border-color--primary vads-u-border-left--10px">
            <p className="vads-u-font-weight--bold vads-u-margin-y--0 vads-u-font-size--lg">
              {`${formData.first} ${formData.middle} ${formData.last}${
                formData.suffix ? `, ${formData.suffix}` : ''
              }`}
            </p>
            <p className="vads-u-margin-bottom--0">
              Last 4 of Social Security number: {formData.ssnLastFour}
              <br />
              Date of birth: {formatDateLong(formData.dateOfBirth)}
            </p>
          </div>
        </div>
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      fullName: {
        type: 'object',
        properties: {
          first: { type: 'string' },
          middle: { type: 'string' },
          last: { type: 'string' },
          suffix: { type: 'string' },
        },
      },
      dateOfBirth: {
        type: 'string',
        properties: {},
        'ui:hidden': true,
      },
      ssnLastFour: {
        type: 'string',
        properties: {},
        'ui:hidden': true,
      },
    },
  },
};

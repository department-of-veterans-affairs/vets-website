import React from 'react';
import {
  selectUI,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import '@department-of-veterans-affairs/web-components/dist/components/va-additional-info';

export default {
  uiSchema: {
    'ui:order': [
      'currentMilitaryStatus',
      'militaryServiceNumber',
      'vaClaimNumber',
    ],
    'ui:description': (
      <div>
        <p>We’ll save your application on every change.</p>
        <h3 className="vads-u-font-size--h3 vads-u-font-weight--bold vads-u-margin-top--4 vads-u-margin-bottom--2">
          Deceased’s military details
        </h3>
      </div>
    ),
    currentMilitaryStatus: selectUI({
      title: 'Current military status',
      description: (
        <>
          <span className="vads-u-color--error">(*Required)</span>
          <br />
          You can add more service history information later in this
          application.
        </>
      ),
      options: [
        { value: '', label: 'Select an option' },
        { value: 'activeDuty', label: 'Active duty' },
        { value: 'retired', label: 'Retired' },
        { value: 'separated', label: 'Separated' },
        { value: 'reserve', label: 'Reserve' },
        { value: 'nationalGuard', label: 'National Guard' },
        { value: 'other', label: 'Other' },
      ],
    }),
    militaryServiceNumber: textUI({
      title: 'Military Service number',
      description: 'If it’s different than their Social Security number',
    }),
    vaClaimNumber: textUI({
      title: 'VA claim number',
      description: (
        <va-additional-info trigger="What is a “VA claim number”?">
          A VA claim number is a unique number assigned to benefit claims. If
          you don’t know it, you can leave this field blank.
        </va-additional-info>
      ),
    }),
  },
  schema: {
    type: 'object',
    required: ['currentMilitaryStatus'],
    properties: {
      currentMilitaryStatus: {
        type: 'string',
        enum: [
          '',
          'activeDuty',
          'retired',
          'separated',
          'reserve',
          'nationalGuard',
          'other',
        ],
        enumNames: [
          'Select an option',
          'Active duty',
          'Retired',
          'Separated',
          'Reserve',
          'National Guard',
          'Other',
        ],
      },
      militaryServiceNumber: textSchema,
      vaClaimNumber: textSchema,
    },
  },
};

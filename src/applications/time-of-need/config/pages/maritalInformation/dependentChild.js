import React from 'react';
import {
  titleUI,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI(
      'Dependent child',
      <va-alert status="info" uswds visible>
        <h3 slot="headline">Supporting documentation needed</h3>
        <p>
          You’ll need to provide supporting documents for an adult-dependent
          child. We’ll ask you to upload these documents in the Supporting
          Documents section of this form.
        </p>
      </va-alert>,
    ),
    hasAdultDependentChild: {
      ...radioUI({
        title: 'Does the Veteran have an adult-dependent child?',
        options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        errorMessages: { required: 'Select Yes or No' },
      }),
      'ui:options': { useV3: true },
    },
    'view:whoWeConsider': {
      'ui:description': (
        <va-additional-info
          trigger="Who we consider an adult-dependent child"
          open
          uswds
        >
          <p>
            We consider someone an adult dependent child if either of these
            descriptions is true:
          </p>
          <ul>
            <li>
              They became permanently physically or mentally disabled and unable
              to support themselves before the age of 21, <strong>or</strong>
            </li>
            <li>
              They became permanently physically or mentally disabled and unable
              to support themselves before the age of 23, if they were enrolled
              full time in a school or training program at the time their
              disability started
            </li>
          </ul>
          <p>
            <strong>Note:</strong> Adult dependent children must be unmarried to
            be eligible for burial in a VA national cemetery.
          </p>
        </va-additional-info>
      ),
    },
  },
  schema: {
    type: 'object',
    required: ['hasAdultDependentChild'],
    properties: {
      hasAdultDependentChild: {
        type: 'string',
        enum: ['yes', 'no'],
        enumNames: ['Yes', 'No'],
      },
      'view:whoWeConsider': {
        type: 'object',
        properties: {},
      },
    },
  },
};

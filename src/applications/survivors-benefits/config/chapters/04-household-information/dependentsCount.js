import React from 'react';
import {
  numberUI,
  numberSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Veteran’s dependent children'),
    'ui:description': (
      <div>
        <p>
          Next we'll ask you for information about the Veteran's dependent
          children.
        </p>
        <p>
          A dependent child is an unmarried child (including an adopted child or
          stepchild) who meets 1 of the eligibility requirements:
        </p>
        <ul>
          <li>They’re under 18 years old, or</li>
          <li>
            They’re between the ages of 18 and 23 years old and enrolled in
            school full time, or
          </li>
          <li>They became permanently disabled before they turned 18</li>
        </ul>
      </div>
    ),
    veteranChildrenCount: numberUI({
      title: 'Enter the number of the Veteran’s dependent children',
      hint: 'If no dependents, enter 0.',
      min: 0,
      max: 99,
      errorMessages: {
        required: 'Enter a number',
      },
    }),
    'view:dependentChildInfo': {
      'ui:description': (
        <va-additional-info trigger="If you have more than 3 dependents">
          <p>
            You can add information for up to 3 dependents in the next section.
            Additional children can be added using VA Form 21-686c and uploaded
            at the end of this application.
          </p>
          <va-link
            href="https://www.va.gov/find-forms/about-form-21-686c/"
            external
            text="Get VA Form 21-686c to download"
          />
        </va-additional-info>
      ),
      'ui:options': {
        displayEmptyObjectOnReview: true,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['veteranChildrenCount'],
    properties: {
      veteranChildrenCount: numberSchema,
      'view:dependentChildInfo': {
        type: 'object',
        properties: {},
      },
    },
  },
};

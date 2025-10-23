import React from 'react';
import {
  textUI,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import YellowRibbonProgramTitle from '../components/YellowRibbonProgramTitle';

const uiSchema = {
  'ui:title': () => <YellowRibbonProgramTitle text="Provide your" />,
  'ui:description': () => (
    <>
      <p>
        Enter the maximum number of students your school agrees to support, the
        degree level, the name of the college or professional school (if
        applicable), and the maximum contribution amount per student for the
        academic year.
      </p>
      <p>
        <va-link
          external
          text="Review additional instructions for the Yellow Ribbon Program Agreement"
          href="/school-administrators/submit-yellow-ribbon-program-agreement-form-22-0839/yellow-ribbon-instructions"
        />
      </p>
    </>
  ),
  maximumStudents: {
    ...textUI({
      title: 'Maximum number of students',
      description:
        'Enter the total number of students eligible for this contribution.',
      errorMessages: {
        required: 'Enter the maximum number of students',
      },
    }),
    'ui:options': {
      inputType: 'number',
      classNames: 'vads-u-margin-bottom--2 container',
    },
  },
  degreeLevel: {
    ...textUI({
      title: 'Degree level',
      description: `If you'd like to specify a school, you can do so in the "College or professional school" field below.`,
      errorMessages: {
        required: 'Enter the degree level',
      },
    }),
    'ui:options': {
      classNames: 'vads-u-margin-bottom--2 degree-level container',
    },
  },
  collegeOrProfessionalSchool: {
    ...textUI({
      title: 'College or professional school',
      description:
        'Do not list specific degree programs (such as Master of Business Administration, Juris Doctorate, Bachelor of Science in Nursing).',
      errorMessages: {
        required: 'Enter the college or professional school name',
      },
    }),
    'ui:options': {
      classNames:
        'vads-u-margin-bottom--2 college-or-professional-school container',
    },
  },
  maximumContributionAmount: {
    ...radioUI({
      title: 'Maximum contribution amount',
      options: [
        {
          value: 'unlimited',
          label:
            "Pay remaining tuition that Post-9/11 GI Bill doesn't cover (unlimited)",
        },
        {
          value: 'specific',
          label: 'Enter a maximum annual contribution amount',
        },
      ],
      errorMessages: {
        required: 'Select a maximum contribution amount option',
      },
    }),
    'ui:options': {
      classNames: 'vads-u-margin-bottom--2 container',
    },
  },
  specificContributionAmount: {
    ...textUI({
      title: 'Specific maximum annual contribution amount',
      errorMessages: {
        required: 'Enter the maximum annual contribution amount',
      },
    }),
    'ui:required': (formData, index) => {
      const currentItem = formData?.yellowRibbonProgramRequest?.[index];
      return currentItem?.maximumContributionAmount === 'specific';
    },
    'ui:options': {
      classNames: 'vads-u-margin-bottom--2 container',
      inputPrefix: '$',
      inputType: 'text',
      inputmode: 'decimal',
      hideIf: (formData, index) => {
        const currentItem = formData?.yellowRibbonProgramRequest?.[index];
        return currentItem?.maximumContributionAmount !== 'specific';
      },
    },
  },
};

const schema = {
  type: 'object',
  properties: {
    maximumStudents: {
      type: 'string',
    },
    degreeLevel: {
      type: 'string',
    },
    collegeOrProfessionalSchool: {
      type: 'string',
    },
    maximumContributionAmount: {
      type: 'string',
      enum: ['unlimited', 'specific'],
      enumNames: [
        "Pay remaining tuition that Post-9/11 GI Bill doesn't cover (unlimited)",
        'Enter a maximum annual contribution amount',
      ],
    },
    specificContributionAmount: {
      type: 'string',
      pattern: '^\\d*(\\.\\d{1,2})?$',
    },
  },
  required: ['maximumStudents', 'degreeLevel', 'maximumContributionAmount'],
  definitions: {},
  anyOf: [
    {
      properties: {
        maximumContributionAmount: {
          const: 'unlimited',
        },
      },
    },
    {
      properties: {
        maximumContributionAmount: {
          const: 'specific',
        },
      },
      required: ['specificContributionAmount'],
    },
  ],
};

export { schema, uiSchema };

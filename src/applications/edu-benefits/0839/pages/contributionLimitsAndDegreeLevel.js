import React from 'react';
import {
  textUI,
  radioUI,
  currencyUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import YellowRibbonProgramTitle from '../components/YellowRibbonProgramTitle';
import DegreeLevelDescription from '../components/DegreeLevelDescription';

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
  maximumStudentsOption: {
    ...radioUI({
      title: 'Maximum number of students',
      options: [
        { value: 'unlimited', label: 'Unlimited number of students' },
        { value: 'specific', label: 'Enter the maximum number of students' },
      ],
      errorMessages: {
        required: 'Select a maximum number of students option',
      },
    }),
    'ui:options': {
      classNames: 'vads-u-margin-bottom--2 container',
    },
  },

  maximumStudents: {
    ...textUI({
      title: 'Enter the maximum number of students',
      description:
        'Enter the total number of students eligible for this contribution. Values over 99,999 are treated as unlimited by the system.',
      errorMessages: {
        required: 'Enter the maximum number of students',
        pattern: 'Enter a whole number',
      },
    }),
    'ui:required': (formData, index) => {
      const currentItem =
        formData?.yellowRibbonProgramRequest?.[index] || formData;
      return currentItem?.maximumStudentsOption === 'specific';
    },
    'ui:options': {
      inputType: 'number',
      classNames:
        'vads-u-margin-bottom--2 contribution-degree-school container',
      expandUnder: 'maximumStudentsOption',
      expandUnderCondition: 'specific',
    },
  },

  degreeLevel: {
    ...textUI({
      title: 'Degree level',
      description: <DegreeLevelDescription />,
      errorMessages: {
        required: 'Please enter a degree level',
      },
    }),
    'ui:options': {
      classNames:
        'vads-u-margin-bottom--2 contribution-degree-school container',
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
        'vads-u-margin-bottom--2 contribution-degree-school container',
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
    ...currencyUI({
      title: 'Maximum contribution amount',
      description:
        'Enter the total annual amount per student, not per term or credit hour. Amounts over $99,999 are treated as unlimited by the system.',
      errorMessages: {
        required: 'Enter the maximum annual contribution amount',
      },
    }),
    'ui:required': (formData, index) => {
      const currentItem =
        formData?.yellowRibbonProgramRequest?.[index] || formData;
      return currentItem?.maximumContributionAmount === 'specific';
    },
    'ui:options': {
      classNames: 'vads-u-margin-bottom--2 container',
      expandUnder: 'maximumContributionAmount',
      expandUnderCondition: 'specific',
    },
  },
};

const schema = {
  type: 'object',
  properties: {
    maximumStudentsOption: {
      type: 'string',
      enum: ['unlimited', 'specific'],
      enumNames: [
        'Unlimited number of students',
        'Enter a specific number of students',
      ],
    },
    maximumStudents: {
      type: 'string',
      pattern: '^\\d+$',
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
  required: [
    'degreeLevel',
    'maximumContributionAmount',
    'collegeOrProfessionalSchool',
    'maximumStudentsOption',
    'specificContributionAmount',
  ],
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

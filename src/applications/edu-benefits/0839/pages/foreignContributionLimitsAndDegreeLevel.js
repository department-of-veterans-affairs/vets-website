import React from 'react';
import {
  textUI,
  radioUI,
  currencyUI,
  selectUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import YellowRibbonProgramTitle from '../components/YellowRibbonProgramTitle';
import { CURRENCY_ENUM, CURRENCY_LABELS } from '../constants';

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
        'Enter the total number of students eligible for this contribution.',
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
      description: `If you'd like to specify a school, you can do so in the "College or professional school" field below.`,
      errorMessages: {
        required: 'Enter the degree level',
      },
    }),
    'ui:options': {
      classNames: 'vads-u-margin-bottom--2 degree-level',
    },
  },
  schoolCurrency: {
    ...selectUI({
      title: 'Select the official currency used for school billing',
      description:
        "We'll convert this to U.S. dollars using the official exchange rate.",
      errorMessages: { required: 'Please make a selection' },
    }),

    'ui:options': {
      labels: CURRENCY_LABELS,
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
      classNames: 'vads-u-margin-bottom--2',
    },
  },
  specificContributionAmount: {
    ...currencyUI({
      title: 'Specific maximum annual contribution amount',
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
      classNames: 'vads-u-margin-bottom--2',
      expandUnder: 'maximumContributionAmount',
      expandUnderCondition: 'specific',
      currencySymbol: ' ',
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
    schoolCurrency: {
      type: 'string',
      enum: CURRENCY_ENUM,
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
      type: 'number',
      minimum: 0,
    },
  },
  required: [
    'degreeLevel',
    'maximumContributionAmount',
    'schoolCurrency',
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

import React from 'react';
import {
  numberUI,
  textUI,
  radioUI,
  currencyUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { validateWhiteSpace } from 'platform/forms/validations';
import YellowRibbonProgramTitle from '../components/YellowRibbonProgramTitle';

const uiSchema = {
  'ui:title': () => (
    <YellowRibbonProgramTitle
      eligibilityChapter={false}
      text="Provide your Yellow Ribbon Program contributions"
    />
  ),
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
  maximumStudentsOption: radioUI({
    title: 'Maximum number of students',
    errorMessages: {
      required: 'Select a maximum number of students option',
    },
    descriptions: {
      unlimited:
        'Values equal to or greater than 99,999 are treated as unlimited by the system',
    },
    labels: {
      unlimited: 'Unlimited number of students',
      specific: 'Enter a specific number of students',
    },
    'ui:options': {
      classNames: 'vads-u-margin-bottom--2 container',
    },
  }),
  maximumStudents: {
    ...numberUI({
      title: 'Enter the maximum number of students',
      hint:
        'Enter the total number of students eligible for this contribution. Maximum limit is 99,998.',
      max: 99998,
      errorMessages: {
        required: 'Enter the maximum number of students',
        pattern: 'Enter a whole number',
      },
      expandUnder: 'maximumStudentsOption',
      expandUnderCondition: 'specific',
    }),
    'ui:required': (formData, index) => {
      const currentItem =
        formData?.yellowRibbonProgramRequest?.[index] || formData;
      return currentItem?.maximumStudentsOption === 'specific';
    },
  },
  degreeLevel: {
    ...textUI({
      title: 'Degree level',
      description:
        'Provide a degree level such as undergraduate, graduate, doctoral, or all. If you’d like to specify a school, you can do so in the "College or professional school" field below.',
      errorMessages: {
        required: 'Please enter a degree level',
      },
      validations: [validateWhiteSpace],
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
      validations: [validateWhiteSpace],
    }),
    'ui:options': {
      classNames:
        'vads-u-margin-bottom--2 contribution-degree-school container',
    },
  },
  maximumContributionAmount: radioUI({
    title: 'Maximum contribution amount',
    descriptions: {
      unlimited:
        'Values equal to or greater than 99,999 are treated as unlimited by the system',
    },
    labels: {
      unlimited:
        'Pay remaining mandatory tuition and fees not covered by Post-9/11 GI Bill (unlimited)',
      specific: 'Enter a maximum annual contribution amount',
    },
    errorMessages: {
      required: 'Select a maximum contribution amount option',
    },
    'ui:options': {
      classNames: 'vads-u-margin-bottom--2 container',
    },
  }),
  specificContributionAmount: {
    ...currencyUI({
      title:
        'Enter the maximum annual contribution amount for this degree level or professional school. ',
      description:
        'Enter the total annual amount per student, not per term or credit hour. Maximum limit is 99,998.99.',
      errorMessages: {
        required: 'Enter the maximum annual contribution amount',
      },
      max: 99998.99,
    }),
    'ui:required': (formData, index) => {
      const currentItem =
        formData?.yellowRibbonProgramRequest?.[index] || formData;
      return currentItem?.maximumContributionAmount === 'specific';
    },
    'ui:options': {
      classNames:
        'vads-u-margin-bottom--2 contribution-degree-school container',
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
    },
    specificContributionAmount: {
      type: 'string',
      pattern: '^\\d+(\\.\\d{1,2})?$',
    },
  },
  required: [
    'degreeLevel',
    'maximumContributionAmount',
    'maximumStudentsOption',
  ],
};

export { schema, uiSchema };

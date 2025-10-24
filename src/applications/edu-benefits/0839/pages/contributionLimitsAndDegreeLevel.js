import React from 'react';
import {
  textUI,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import YellowRibbonProgramTitle from '../components/YellowRibbonProgramTitle';
import SpecificContributionAmount from '../components/SpecificContributionAmount';
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
  maximumStudents: {
    ...textUI({
      title: 'Maximum number of students',
      description:
        'Enter the total number of students eligible for this contribution.',
      errorMessages: {
        required: 'Enter the maximum number of students',
      },
    }),
    'ui:required': (formData, index) =>
      !formData.yellowRibbonProgramRequest?.[index]?.eligibleIndividualsGroup
        ?.unlimitedIndividuals,
    'ui:options': {
      inputType: 'number',
      classNames:
        'vads-u-margin-bottom--2 contribution-degree-school container',
      hideIf: (formData, index) =>
        formData.yellowRibbonProgramRequest?.[index]?.eligibleIndividualsGroup
          ?.unlimitedIndividuals,
    },
    'ui:validations': [
      (errors, fieldData, formData) => {
        const eligibleIndividuals =
          formData.eligibleIndividualsGroup?.eligibleIndividuals;
        if (eligibleIndividuals !== fieldData) {
          errors.addError(
            `Maximum number of students must match the number of individuals you entered earlier`,
          );
        }
      },
    ],
  },
  unlimitedStudentsDisplay: {
    'ui:title': 'Maximum number of students',
    'ui:options': {
      classNames: 'vads-u-margin-bottom--2 unlimited-students-display',
      hideIf: (formData, index) =>
        !formData.yellowRibbonProgramRequest?.[index]?.eligibleIndividualsGroup
          ?.unlimitedIndividuals,
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
      hideIf: formData => !formData.institutionDetails?.isUsaSchool,
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
        required: 'Please make a selection',
      },
    }),
    'ui:required': (formData, index) =>
      !formData.yellowRibbonProgramRequest?.[index]?.eligibleIndividualsGroup
        ?.unlimitedIndividuals,
    'ui:options': {
      classNames: 'vads-u-margin-bottom--2 container',
      hideIf: (formData, index) =>
        formData.yellowRibbonProgramRequest?.[index]?.eligibleIndividualsGroup
          ?.unlimitedIndividuals,
    },
  },
  specificContributionAmount: {
    'ui:widget': SpecificContributionAmount,
    'ui:options': {
      classNames: 'vads-u-margin-bottom--2 container',
      inputPrefix: '$',
      inputType: 'text',
      inputmode: 'decimal',
      hideIf: (formData, index) => {
        const currentItem = formData?.yellowRibbonProgramRequest?.[index];
        const maximumContributionAmount =
          currentItem?.maximumContributionAmount;
        if (maximumContributionAmount) {
          return maximumContributionAmount !== 'specific';
        }

        return !currentItem?.eligibleIndividualsGroup?.unlimitedIndividuals;
      },
    },
    'ui:errorMessages': {
      required: 'Enter the maximum annual contribution amount',
    },
    'ui:required': (formData, index) => {
      const currentItem = formData?.yellowRibbonProgramRequest?.[index];
      const maximumContributionAmount = currentItem?.maximumContributionAmount;

      if (maximumContributionAmount) {
        return maximumContributionAmount === 'specific';
      }

      return currentItem?.eligibleIndividualsGroup?.unlimitedIndividuals;
    },
  },
};

const schema = {
  type: 'object',
  properties: {
    maximumStudents: {
      type: 'string',
    },
    unlimitedStudentsDisplay: {
      type: 'string',
      default: 'My school will support an unlimited number of individuals',
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
  required: ['degreeLevel'],
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

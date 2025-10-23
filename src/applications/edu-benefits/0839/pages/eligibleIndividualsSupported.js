import React from 'react';
import { textUI } from 'platform/forms-system/src/js/web-component-patterns';
import YellowRibbonProgramTitle from '../components/YellowRibbonProgramTitle';
import { getAcademicYearDisplay } from '../helpers';

const uiSchema = {
  'ui:title': () => <YellowRibbonProgramTitle text="Provide your" />,
  'ui:description': () => (
    <p>
      <va-link
        external
        text="Review additional instructions for the Yellow Ribbon Program Agreement"
        href="/school-administrators/submit-yellow-ribbon-program-agreement-form-22-0839/yellow-ribbon-instructions"
      />
    </p>
  ),
  eligibleIndividuals: {
    ...textUI({
      title:
        'How many eligible individuals will your school support through Yellow Ribbon contributions?',
      description:
        'Note: The number of individuals must match the maximum number of students in the contribution details later in the form',
      classNames: 'vads-u-margin-bottom--2',
      errorMessages: {
        required:
          'Enter the number of eligible individuals or select "Unlimited number of individuals"',
      },
    }),
    'ui:options': {
      classNames: 'vads-u-margin-bottom--1 eligible-individuals-note',
    },
    'ui:validations': [
      (_, fieldData, formData) => {
        const newBal = fieldData.replace(/,/g, '');
        const numValue = parseInt(newBal, 10);
        if (fieldData && fieldData !== '') {
          if (numValue >= 99999) {
            // eslint-disable-next-line no-param-reassign
            formData.unlimitedIndividuals = true;
          } else {
            // eslint-disable-next-line no-param-reassign
            formData.unlimitedIndividuals = false;
          }
        }
      },
    ],
  },

  unlimitedIndividuals: {
    'ui:title': 'My school will support an unlimited number of individuals',
    'ui:widget': 'checkbox',
    'ui:options': {
      classNames: 'vads-u-margin-bottom--3 vads-u-margin-top--3',
    },
  },

  academicYear: {
    ...textUI({
      title: 'What academic year does this agreement apply to?',
      description: `Enter the academic year (such as ${getAcademicYearDisplay()})`,
      errorMessages: {
        required: `Enter the academic year, such as ${getAcademicYearDisplay()}`,
      },
    }),
    'ui:options': {
      classNames: 'vads-u-margin-bottom--2 eligible-individuals-note',
      hideIf: formData =>
        formData.agreementType === 'startNewOpenEndedAgreement',
    },
    'ui:validations': [
      (errors, fieldData) => {
        if (fieldData !== getAcademicYearDisplay()) {
          errors.addError(
            `Enter the upcoming academic year this agreement applies to`,
          );
        }
      },
    ],
  },
  academicYearDisplay: {
    'ui:title': 'What academic year does this agreement apply to?',
    'ui:widget': 'text',
    'ui:readonly': true,
    'ui:options': {
      hideIf: formData =>
        formData.agreementType !== 'startNewOpenEndedAgreement',
      classNames: 'eligible-individuals-note',
    },
  },
};

const schema = {
  type: 'object',
  properties: {
    eligibleIndividuals: {
      type: 'string',
    },
    unlimitedIndividuals: {
      type: 'boolean',
    },
    academicYear: {
      type: 'string',
    },
    academicYearDisplay: {
      type: 'string',
      default: getAcademicYearDisplay(),
    },
  },
  required: ['eligibleIndividuals', 'academicYear'],
  definitions: {},
  anyOf: [
    {
      properties: {
        eligibleIndividuals: {
          type: 'string',
        },
      },
      required: ['eligibleIndividuals'],
    },
    {
      properties: {
        unlimitedIndividuals: {
          type: 'boolean',
          const: true,
        },
      },
      required: ['unlimitedIndividuals'],
    },
  ],
};

export { uiSchema, schema };

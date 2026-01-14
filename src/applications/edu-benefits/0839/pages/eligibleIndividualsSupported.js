import React from 'react';
import { textUI } from 'platform/forms-system/src/js/web-component-patterns';
import YellowRibbonProgramTitle from '../components/YellowRibbonProgramTitle';
import { getAcademicYearDisplay, matchYearPattern } from '../helpers';

const uiSchema = {
  'ui:title': () => (
    <YellowRibbonProgramTitle
      eligibilityChapter
      text="Provide academic year this agreement will apply to"
    />
  ),
  'ui:description': () => (
    <p>
      <va-link
        external
        text="Review additional instructions for the Yellow Ribbon Program Agreement"
        href="/school-administrators/submit-yellow-ribbon-program-agreement-form-22-0839/yellow-ribbon-instructions"
      />
    </p>
  ),

  academicYear: {
    ...textUI({
      title: 'What academic year does this agreement apply to?',
      description: `Enter the academic year, such as ${getAcademicYearDisplay()}`,
      errorMessages: {
        required: `Enter the academic year, such as ${getAcademicYearDisplay()}`,
      },
    }),
    'ui:required': (formData, index) =>
      index === 0 && formData?.agreementType !== 'startNewOpenEndedAgreement',
    'ui:options': {
      classNames: 'vads-u-margin-bottom--2 eligible-individuals-note container',
      useAllFormData: true,
      hideIf: (formData, index) =>
        index !== 0 || formData?.agreementType === 'startNewOpenEndedAgreement',
    },
    'ui:validations': [
      (errors, fieldData, formData) => {
        if (
          fieldData &&
          fieldData !== getAcademicYearDisplay() &&
          formData?.agreementType === 'startNewOpenEndedAgreement'
        ) {
          errors.addError(
            `Enter the upcoming academic year this agreement applies to`,
          );
        }

        if (
          fieldData &&
          !matchYearPattern(fieldData) &&
          formData?.agreementType !== 'startNewOpenEndedAgreement'
        ) {
          errors.addError(
            `Enter the academic year, such as ${getAcademicYearDisplay()}`,
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
      hideIf: (formData, index) =>
        index !== 0 || formData?.agreementType !== 'startNewOpenEndedAgreement',
      classNames: 'eligible-individuals-note',
    },
  },
};

const schema = {
  type: 'object',
  properties: {
    academicYear: {
      type: 'string',
    },
    academicYearDisplay: {
      type: 'string',
      default: getAcademicYearDisplay(),
    },
  },
  definitions: {},
};

export { uiSchema, schema };

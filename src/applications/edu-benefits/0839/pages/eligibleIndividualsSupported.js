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
      description: `Enter the academic year, such as ${getAcademicYearDisplay()}. You can enter a previous academic year.`,
      errorMessages: {
        required: `Enter the academic year, such as ${getAcademicYearDisplay()}. You can enter a previous academic year.`,
      },
    }),
    'ui:required': (_formData, index) => index === 0,
    'ui:options': {
      classNames: 'vads-u-margin-bottom--2 eligible-individuals-note container',
      useAllFormData: true,
      hideIf: (_formData, index) => index !== 0,
    },
    'ui:validations': [
      (errors, fieldData) => {
        if (fieldData && !matchYearPattern(fieldData)) {
          errors.addError(
            `Enter the academic year, such as ${getAcademicYearDisplay()}. You can enter a previous academic year.`,
          );
        }
      },
    ],
  },
};

const schema = {
  type: 'object',
  properties: {
    academicYear: {
      type: 'string',
    },
  },
  definitions: {},
};

export { uiSchema, schema };

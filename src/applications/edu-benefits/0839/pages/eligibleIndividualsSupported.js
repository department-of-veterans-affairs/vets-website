import React from 'react';
import { textUI } from 'platform/forms-system/src/js/web-component-patterns';
import YellowRibbonProgramTitle from '../components/YellowRibbonProgramTitle';
// import EligibleIndividualsField from '../components/EligibleIndividualsField';
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
  // eligibleIndividualsGroup: {
  //   'ui:webComponentField': EligibleIndividualsField,
  //   'ui:options': {
  //     classNames: 'eligible-individuals-note container',
  //   },
  //   'ui:required': (formData, index, _fullData) => {
  //     if (index !== undefined) {
  //       return !formData.eligibleIndividualsGroup?.unlimitedIndividuals;
  //     }
  //     return !formData.eligibleIndividualsGroup?.unlimitedIndividuals;
  //   },
  //   'ui:validations': [
  //     (errors, fieldData) => {
  //       const isUnlimited = fieldData?.unlimitedIndividuals;
  //       const hasValue =
  //         fieldData?.eligibleIndividuals &&
  //         fieldData?.eligibleIndividuals.trim() !== '';

  //       if (!isUnlimited && !hasValue) {
  //         errors.addError(
  //           'Enter the number of eligible individuals or select the checkbox below ',
  //         );
  //       }
  //     },
  //   ],
  // },

  academicYear: {
    ...textUI({
      title: 'What academic year does this agreement apply to?',
      description: `Enter the academic year (such as ${getAcademicYearDisplay()})`,
      errorMessages: {
        required: `Enter the academic year, such as ${getAcademicYearDisplay()}`,
      },
    }),
    'ui:required': (formData, index, fullData) => {
      if (index !== undefined) {
        return fullData?.agreementType !== 'startNewOpenEndedAgreement';
      }
      return formData?.agreementType !== 'startNewOpenEndedAgreement';
    },
    'ui:options': {
      classNames: 'vads-u-margin-bottom--2 eligible-individuals-note container',
      hideIf: (formData, index, fullData) => {
        if (index !== undefined) {
          return fullData?.agreementType === 'startNewOpenEndedAgreement';
        }
        return formData?.agreementType === 'startNewOpenEndedAgreement';
      },
    },
    'ui:validations': [
      (errors, fieldData) => {
        if (fieldData && fieldData !== getAcademicYearDisplay()) {
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
      hideIf: (formData, index, fullData) => {
        if (index !== undefined) {
          return fullData?.agreementType !== 'startNewOpenEndedAgreement';
        }
        return formData?.agreementType !== 'startNewOpenEndedAgreement';
      },
      classNames: 'eligible-individuals-note',
    },
  },
};

const schema = {
  type: 'object',
  properties: {
    // eligibleIndividualsGroup: {
    //   type: 'object',
    //   properties: {
    //     eligibleIndividuals: {
    //       type: 'string',
    //     },
    //     unlimitedIndividuals: {
    //       type: 'boolean',
    //     },
    //   },
    // },
    academicYear: {
      type: 'string',
    },
    academicYearDisplay: {
      type: 'string',
      default: getAcademicYearDisplay(),
    },
  },
  // required: ['eligibleIndividualsGroup'],
  definitions: {},
};

export { uiSchema, schema };

// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
  titleUI,
  numberSchema,
  numberUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import PercentageCalc from '../components/PercentageCalc';
import CustomReviewField from '../ReviewPage/CustomReviewField';
import { isDateThirtyDaysOld, isValidStudentRatio } from '../utilities';
import RatioExceedMessage from '../components/RatioExceedMessage';

export default {
  uiSchema: {
    studentRatioCalcChapter: {
      ...titleUI('35% exemption calculation'),
      beneficiaryStudent: {
        ...numberUI({
          title: 'Number of VA beneficiary students',
          errorMessages: {
            required:
              'Please enter the number of beneficiary students at your institution',
          },
        }),
        'ui:validations': [
          (errors, fieldData, formData) => {
            if (!isValidStudentRatio(formData)) {
              errors.addError(
                'The calculation percentage exceeds 35%. Please check your numbers, and if you believe this calculation is an error, contact your ELR',
              );
            }
          },
        ],
      },
      numOfStudent: {
        ...numberUI({
          title: 'Total number of students',
          errorMessages: {
            required: 'Please enter the total number of students',
          },
        }),
        'ui:validations': [
          (errors, fieldData, formData) => {
            const numOfStudent = Number(fieldData);
            const beneficiaryStudent = Number(
              formData?.studentRatioCalcChapter?.beneficiaryStudent,
            );
            if (numOfStudent < beneficiaryStudent) {
              errors.addError(
                'Number of VA beneficiaries cannot surpass the total number of students',
              );
            }
          },
        ],
      },
      studentPercentageCalc: {
        'ui:title': 'VA beneficiary students percentage (calculated)',
        'ui:field': PercentageCalc,
        'ui:reviewField': CustomReviewField,
        'ui:options': {
          classNames: 'vads-u-margin-top--2',
        },
      },
      dateOfCalculation: {
        ...currentOrPastDateUI({
          title: 'Date of calculation',
          hint:
            'Provide the date the 35% calculation was performed. This date must be on or after but not later than 30 days after the start of the term.',
          errorMessages: {
            required: 'Please enter a date',
          },
        }),
        'ui:validations': [
          (errors, fieldData, formData) => {
            const {
              institutionDetails: { termStartDate },
            } = formData;
            if (isDateThirtyDaysOld(fieldData, termStartDate)) {
              errors.addError(
                'Please enter a date within 30 calendar days of the term start date',
              );
            }
          },
        ],
      },
      'view:ratioExceedMessage': {
        'ui:description': RatioExceedMessage,
        'ui:options': {
          hideIf: formData => {
            return isValidStudentRatio(formData);
          },
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      studentRatioCalcChapter: {
        type: 'object',
        properties: {
          beneficiaryStudent: numberSchema,
          numOfStudent: numberSchema,
          studentPercentageCalc: {
            type: 'number',
          },
          dateOfCalculation: currentOrPastDateSchema,
          'view:ratioExceedMessage': { type: 'object', properties: {} },
        },
        required: ['beneficiaryStudent', 'numOfStudent', 'dateOfCalculation'],
      },
    },
  },
};

import {
  titleUI,
  textUI,
  numberUI,
  addressNoMilitarySchema,
  textSchema,
  numberSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';
import { employedByVAFields } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    [employedByVAFields.parentObject]: {
      ...titleUI({
        title: 'Section 2 - Employment Information',
      }),
      [employedByVAFields.employerName]: textUI('Name of employer'),
      [employedByVAFields.employerAddress]: addressNoMilitarySchema({
        omit: ['street2', 'street3'],
      }),
      [employedByVAFields.typeOfWork]: textUI({
        hint: 'If self-employed enter "Self"',
        title: 'Type of work',
      }),
      [employedByVAFields.hoursPerWeek]: numberUI({
        title: 'Hours per week',
        min: 0,
        errorMessages: {
          required:
            'Enter the number of hours you worked per week. This field is required.',
          pattern: 'Enter the hours you worked per week using numbers only.',
        },
      }),
      [employedByVAFields.datesOfEmployment]: dateRangeUI(
        'Dates of Employment (Start Date)',
        'Dates of Employment (End Date)',
        'End date must be after start date',
      ),
      [employedByVAFields.lostTime]: numberUI({
        title: 'Lost time',
        hint: 'Total hours lost from illness',
        errorMessages: {
          required:
            'Enter the total hours you lost from illness. This field is required.',
          pattern:
            'Enter the total hours lost from illness using numbers only.',
        },
      }),
      [employedByVAFields.highestIncome]: numberUI({
        title: 'Highest income',
        min: 0,
        errorMessages: {
          required:
            'Enter the highest monthly income you earned before taxes. This field is required.',
          pattern: 'Enter your highest monthly income using numbers only.',
        },
      }),
    },
  },

  schema: {
    type: 'object',
    properties: {
      [employedByVAFields.parentObject]: {
        type: 'object',
        required: [
          [
            'employerName',
            'typeOfWork',
            'hoursPerWeek',
            'lostTime',
            'highestIncome',
          ],
        ],
        properties: {
          [employedByVAFields.employerName]: textSchema,
          [employedByVAFields.employerAddress]: addressNoMilitarySchema({
            omit: ['street2', 'street3'],
          }),
          [employedByVAFields.typeOfWork]: textSchema,
          [employedByVAFields.hoursPerWeek]: numberSchema,
          [employedByVAFields.lostTime]: textSchema,
          [employedByVAFields.highestIncome]: numberSchema,
        },
      },
    },
  },
};

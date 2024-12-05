// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import React from 'react';
import { currentOrPastDateUI } from 'platform/forms-system/src/js/web-component-patterns/datePatterns';
import PercentageCalc from './PercentageCalc';
import { ratioCalcInfoHelpText } from './RatioCalc';

// Example of an imported schema:
// import fullSchema from '../22-10216-schema.json';
// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/22-10216-schema.json';

let percentage;

export default {
  uiSchema: {
    studentRatioCalcChapter: {
      'ui:title': '35% exemption calculation',
      beneficiaryStudent: {
        'ui:title': 'Number of VA beneficiary students',
        'ui:errorMessages': {
          required:
            'Please enter the number of beneficiary students at your institution',
        },
        // 'ui:validations': [
        //   (_, field) => {
        //     myFunc(field);
        //   },
        // ],
        // },
      },
      numOfStudent: {
        'ui:title': 'Total number of students',
        'ui:errorMessages': {
          required: 'Please enter the total number of students',
        },
        // 'ui:validations': [
        //   (_, field) => {
        //     myFunc(field);
        //   },
        // ],
        // },
      },
      studentPercentageCalc: {
        'ui:title': 'VA beneficiary students percentage (calculated)',
        'ui:field': () => <PercentageCalc percentage={percentage} />,
      },

      'view:ratioCalcInfoHelpText': {
        'ui:description': ratioCalcInfoHelpText,
      },
      dateOfCalculation: {
        ...currentOrPastDateUI({
          title: 'Date of calculation',
          hint:
            'Provide the date that 35% calculation was completed. This must be within 30 calendar days of the term start date.',
          errorMessages: {
            required: 'Please enter a date',
          },
        }),
      },
      'ui:validations': [
        (_, data) => {
          percentage =
            data?.numOfStudent > 0
              ? ((data?.beneficiaryStudent + data?.numOfStudent) / 100).toFixed(
                  2,
                )
              : '---';
        },
      ],
    },
  },
  schema: {
    type: 'object',
    properties: {
      studentRatioCalcChapter: {
        type: 'object',
        properties: {
          beneficiaryStudent: { type: 'string' },
          numOfStudent: { type: 'string' },
          studentPercentageCalc: { type: 'string' },
          'view:ratioCalcInfoHelpText': {
            type: 'object',
            properties: {},
          },
          dateOfCalculation: {
            type: 'string',
          },
        },
        required: ['beneficiaryStudent', 'numOfStudent', 'dateOfCalculation'],
      },
    },
  },
};

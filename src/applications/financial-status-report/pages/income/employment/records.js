// import monthYearUI from 'platform/forms-system/src/js/definitions/monthYear';
// import ArrayField from 'platform/forms-system/src/js/fields/ArrayField';
// import _ from 'lodash/fp';

// import React from 'react';
// import _ from 'lodash/fp';
// import TableDetailsView from '../../../components/TableDetailsView';
// import CustomReviewField from '../../../components/CustomReviewField';
// import currencyUI from 'platform/forms-system/src/js/definitions/currency';
// import Typeahead from '../../../components/Typeahead';
// import {
//   formatOptions,
//   deductionTypes,
// } from '../../../constants/typeaheadOptions';

// import { updateUiSchema } from 'platform/forms-system/src/js/state/helpers';

import ItemLoop from '../../../components/ItemLoop';
import CardDetailsView from '../../../components/CardDetailsView';
import EmploymentRecord from '../../../components/EmploymentRecord';

export const uiSchema = {
  'ui:title': 'Your work history',
  'ui:description':
    'Tell us about the jobs you’ve had in the past two years that you received paychecks for. You’ll need to provide your income information for any current job.',
  personalData: {
    employmentHistory: {
      veteran: {
        employmentRecords: {
          'ui:field': ItemLoop,
          // 'ui:field': ArrayField,
          'ui:options': {
            viewField: CardDetailsView,
            doNotScroll: true,
            showSave: true,
            itemName: 'job',
            keepInPageOnReview: true,
            minItems: 1,
          },
          items: {
            'ui:options': {
              classNames: 'vads-u-margin-bottom--3',
            },
            'ui:field': EmploymentRecord,

            // type: {
            //   'ui:required': (formData, index) => {
            //     // console.log('formData: ', formData);
            //     // return formData?.personalData?.employmentHistory.veteran
            //     //   .employmentRecords[index]?.type;
            //     return true;
            //   },
            // },
            // from: monthYearUI('Date you started work at this job?'),

            // to: _.merge(monthYearUI('Date you stopped work at this job?'), {
            //   // 'ui:options': {
            //   //   hideIf: (formData, index) => {
            //   //     const { veteran } = formData.personalData.employmentHistory;
            //   //     const { employmentRecords } = veteran;
            //   //     return employmentRecords[index].isCurrent;
            //   //   },
            //   // },
            //   // 'ui:options': {
            //   //   updateItemsSchema: (schema, fieldData) => {
            //   //     console.log('schema: ', schema);
            //   //     console.log('fieldData: ', fieldData);
            //   //   },
            //   // },
            //   'ui:options': {
            //     updateSchema: (formData, schema, pageUiSchema, index) => {
            //       console.log('schema: ', schema);
            //       console.log('pageUiSchema: ', pageUiSchema);
            //       const currentUiSchema = pageUiSchema;
            //       const { veteran } = formData.personalData.employmentHistory;
            //       const { isCurrent } = veteran.employmentRecords[index];
            //       currentUiSchema['ui:disabled'] = isCurrent;
            //       console.log(`index ${index} isCurrent: `, isCurrent);
            //       console.log(
            //         `currentUiSchema['ui:disabled']: `,
            //         currentUiSchema['ui:disabled'],
            //       );
            //       console.log('currentUiSchema: ', currentUiSchema);
            //       return currentUiSchema;
            //     },
            //   },
            // }),

            // isCurrent: {
            //   // 'ui:title': 'I currently work here',

            //   'ui:field': EmploymentRecord,

            //   'ui:options': {
            //     widgetClassNames: 'vads-u-margin-top--2',
            //   },
            // },

            // employerName: {
            //   'ui:title': 'Employer name',
            //   'ui:options': {
            //     classNames: 'vads-u-margin-top--3',
            //     widgetClassNames: 'input-size-6',
            //   },
            // },
          },
        },
        // employmentRecords: {
        //   type: {
        //     'ui:title': 'Type of work',
        //     'ui:options': {
        //       classNames: 'vads-u-margin-top--3',
        //       widgetClassNames: 'input-size-3',
        //     },
        //   },
        //   from: monthYearUI('Date you started work at this job'),
        //   employerName: {
        //     'ui:title': 'Employer name',
        //     'ui:options': {
        //       widgetClassNames: 'input-size-6',
        //     },
        //   },
        //   monthlyGrossSalary: _.merge(currencyUI('Gross monthly income'), {
        //     'ui:description': (
        //       <p className="formfield-subtitle">
        //         You’ll find this in your paycheck. It’s the amount of your pay
        //         before taxes and deductions.
        //       </p>
        //     ),
        //     'ui:options': {
        //       widgetClassNames: 'input-size-1 vads-u-margin-bottom--3',
        //     },
        //   }),
        //   deductions: {
        //     'ui:field': ItemLoop,
        //     'ui:title': 'Payroll deductions',
        //     'ui:description':
        //       'You’ll find your payroll deductions in a recent paycheck. Deductions include money withheld from your pay for things like taxes and benefits.',
        //     'ui:options': {
        //       viewType: 'table',
        //       viewField: TableDetailsView,
        //       doNotScroll: true,
        //       showSave: true,
        //       itemName: 'payroll deduction',
        //       keepInPageOnReview: true,
        //     },
        //     items: {
        //       'ui:options': {
        //         classNames: 'horizontal-field-container no-wrap',
        //       },
        //       name: {
        //         'ui:title': 'Type of payroll deduction',
        //         'ui:field': Typeahead,
        //         'ui:reviewField': CustomReviewField,
        //         'ui:options': {
        //           idPrefix: 'employment',
        //           getOptions: () => formatOptions(deductionTypes),
        //         },
        //       },
        //       amount: _.merge(currencyUI('Deduction amount'), {
        //         'ui:options': {
        //           widgetClassNames: 'input-size-1',
        //         },
        //       }),
        //     },
        //   },
        // },
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    personalData: {
      type: 'object',
      properties: {
        employmentHistory: {
          type: 'object',
          properties: {
            veteran: {
              type: 'object',
              properties: {
                employmentRecords: {
                  type: 'array',
                  items: {
                    type: 'object',
                    // required: ['type'],
                    properties: {
                      type: {
                        type: 'string',
                        enum: [
                          'Full time',
                          'Part time',
                          'Seasonal',
                          'Temporary',
                        ],
                      },
                      from: {
                        type: 'string',
                      },
                      to: {
                        type: 'string',
                      },
                      isCurrent: {
                        type: 'boolean',
                      },
                      employerName: {
                        type: 'string',
                      },
                    },
                  },
                },
                // employmentRecords: {
                //   type: 'object',
                //   required: ['type', 'from', 'monthlyGrossSalary'],
                //   properties: {
                //     type: {
                //       type: 'string',
                //       enum: [
                //         'Contractor',
                //         'Full time',
                //         'Part time',
                //         'Seasonal',
                //         'Temporary',
                //       ],
                //     },
                //     from: {
                //       type: 'string',
                //     },
                //     employerName: {
                //       type: 'string',
                //     },
                //     monthlyGrossSalary: {
                //       type: 'number',
                //     },
                //     deductions: {
                //       type: 'array',
                //       items: {
                //         type: 'object',
                //         required: ['name', 'amount'],
                //         properties: {
                //           name: {
                //             type: 'string',
                //           },
                //           amount: {
                //             type: 'number',
                //           },
                //         },
                //       },
                //     },
                //   },
                // },
              },
            },
          },
        },
      },
    },
  },
};

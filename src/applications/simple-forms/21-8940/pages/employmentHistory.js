import {
  titleUI,
  textUI,
  addressUI,
  numberUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  addressSchema,
  numberSchema,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { EmploymentHistoryView } from '../components/viewElements';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Work History Details',
      `List all your employment including self-employment for the last five years you worked
(include any military duty including inactive duty for training) (note: for additional employment information use section v, remarks)`,
    ),
    employersHistory: {
      'ui:options': {
        itemName: "Employer's History",
        viewField: EmploymentHistoryView,
        customTitle: 'Your employers',
        useDlWrap: true,
        keepInPageOnReview: true,
       /* showSave: true,
        reviewMode: true,*/
        doNotScroll: true,
        confirmRemove: true,
        confirmRemoveDescription:
          'Are you sure you want to remove this employer?',
        addAnotherText: 'Add another employer',
      },
      items: {
        'ui:options': {
          classNames: 'vads-u-margin-left--1p5',
        },
        employerName: textUI("Employer's name"),

        employerAddress: addressUI({
          title: 'Employer address',
          omit: ['street2', 'street3', 'isMilitary'],
        }),
        typeOfWork: textUI('Type of work'),
        hoursPerWeek: numberUI('Hours worked per week'),
        startDate: currentOrPastDateUI('Start date'),
        endDate: currentOrPastDateUI('End date (if applicable)'),
        timeLost: numberUI('Time Lost from Illness (number of days lost)'),
        earnings: numberUI('Highest gross earnings per month'),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      employersHistory: {
        type: 'array',
        minItems: 0,
        maxItems: 4,
        items: {
          type: 'object',
          properties: {
            employerName: textSchema,

            employerAddress: addressSchema({
              omit: ['street2', 'street3', 'isMilitary'],
            }),
            typeOfWork: textSchema,
            hoursPerWeek: numberSchema,
            startDate: currentOrPastDateSchema,
            endDate: currentOrPastDateSchema,
            timeLost: numberSchema,
            earnings: numberSchema,
          },
          required: ['employerName', 'typeOfWork', 'employerAddress'],
        },
      },
    },
  },
};

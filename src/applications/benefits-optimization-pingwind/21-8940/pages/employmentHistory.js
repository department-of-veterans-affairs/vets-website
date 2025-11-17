import {
  inlineTitleUI,
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
import SafeArrayField from '../components/SafeArrayField';
import { wrapDateUiWithDl } from '../helpers/reviewHelpers';

const addUseDlWrap = field =>
  field
    ? {
        ...field,
        'ui:options': {
          ...field['ui:options'],
          useDlWrap: true,
        },
      }
    : field;

const addressWithDlWrap = uiSchema =>
  Object.keys(uiSchema).reduce((acc, key) => {
    const value = uiSchema[key];
    if (key.startsWith('ui:') || key.startsWith('view:')) {
      acc[key] = value;
      return acc;
    }

    acc[key] = addUseDlWrap(value);
    return acc;
  }, {});

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...inlineTitleUI(
      'Employment History Details',
      `Your employment history - last 5 years. List all employment (including self-employment) for the last five years you have worked. Also be sure to include any military duty including inactive duty for training.`,
    ),
    employersHistory: {
      'ui:field': SafeArrayField,
      'ui:options': {
        itemName: "Employer's History",
        viewField: EmploymentHistoryView,
        customTitle: 'Your employers',
        useDlWrap: true,
        keepInPageOnReview: true,

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
        employerName: textUI({
          title: "Employer's name",
          useDlWrap: true,
        }),

        employerAddress: addressWithDlWrap(
          addressUI({
            title: 'Employer address',
            labels: {
              postalCode: 'Zip Code',
            },
            omit: ['street2', 'street3', 'isMilitary'],
          }),
        ),
        typeOfWork: textUI({
          title: 'Type of work',
          useDlWrap: true,
        }),
        hoursPerWeek: numberUI({
          title: 'Hours worked per week',
          useDlWrap: true,
        }),
        startDate: wrapDateUiWithDl(
          currentOrPastDateUI({
            title: 'Start date',
          }),
        ),
        endDate: wrapDateUiWithDl(
          currentOrPastDateUI({
            title: 'End date (if applicable)',
          }),
        ),
        timeLost: numberUI({
          title: 'Time Lost from Illness (number of days lost)',
          useDlWrap: true,
        }),
        earnings: numberUI({
          title: 'Highest gross earnings per month',
          useDlWrap: true,
        }),
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

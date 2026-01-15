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
import { HideDefaultDateHint } from '../helpers/dateHint';

const DEFAULT_DL_TITLES = {
  city: 'City',
  state: 'State',
};

const addUseDlWrap = (field, key) => {
  if (!field) {
    return field;
  }

  const updatedField = {
    ...field,
    'ui:options': {
      ...field['ui:options'],
      useDlWrap: true,
    },
  };

  if (key && DEFAULT_DL_TITLES[key] && !updatedField['ui:title']) {
    updatedField['ui:title'] = DEFAULT_DL_TITLES[key];
  }

  return updatedField;
};

const addressWithDlWrap = uiSchema =>
  Object.keys(uiSchema).reduce((acc, key) => {
    const value = uiSchema[key];
    if (key.startsWith('ui:') || key.startsWith('view:')) {
      acc[key] = value;
      return acc;
    }

    acc[key] = addUseDlWrap(value, key);
    return acc;
  }, {});

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...inlineTitleUI(
      'Employment History Details',
      `Your employment history (5 years). List all employment (including self-employment) for the last five years in which you worked. If you haven't worked recently, provide your employment history starting from your most recent job and going back five years from that point. Also be sure to include any military duty including inactive duty for training.`,
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
          max: 168,
          errorMessages: {
            max: 'Hours worked per week cannot exceed 168 hours',
          },
        }),
        startDate: {
          ...wrapDateUiWithDl(
            currentOrPastDateUI({
              title: 'Start date',
              hint: 'For example: January 19 2022',
            }),
          ),
          'ui:description': HideDefaultDateHint,
        },
        endDate: {
          ...wrapDateUiWithDl(
            currentOrPastDateUI({
              title: 'End date (if applicable)',
              hint: 'For example: January 19 2022',
            }),
          ),
          'ui:description': HideDefaultDateHint,
        },
        timeLost: numberUI({
          title: 'Time lost from illness (number of days lost)',
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
        minItems: 1,
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
          required: [
            'employerName',
            'employerAddress',
            'typeOfWork',
            'hoursPerWeek',
            'startDate',
            'timeLost',
            'earnings',
          ],
        },
      },
    },
  },
};

import {
  addressUI,
  addressSchema,
} from 'platform/forms-system/src/js/web-component-patterns/addressPattern';

import {
  textUI,
  textSchema,
  currentOrPastDateSchema,
  currentOrPastDateUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { HospitalView, DateRangeView } from '../components/viewElements';
import SafeArrayField from '../components/SafeArrayField';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Hospital Information',
      'Please provide information about your hospital stays and treatment dates',
    ),
    hospitals: {
      'ui:field': SafeArrayField,
      'ui:options': {
        itemName: 'Hospital',
        viewField: HospitalView,
        customTitle: ' ',
        useDlWrap: true,
        keepInPageOnReview: true,
        doNotScroll: true,
        confirmRemove: true,
        confirmRemoveDescription:
          'Are you sure you want to remove this hospital?',
      },
      items: {
        'ui:options': {
          classNames: 'vads-u-margin-left--1p5',
        },
        hospitalName: {
          ...textUI('Hospital name'),
          'ui:required': () => true,
        },
        hospitalAddress: {
          ...addressUI({
            labels: {
              militaryCheckbox: 'Hospital is on a military base',
            },
          }),
          'ui:required': () => true,
        },
        connectedDisabilities: {
          ...textUI('Connected disabilities'),
          'ui:description': 'Enter disabilities separated by commas (e.g., PTSD, Hearing Loss, Back Pain)',
        },
      },
    },
    treatmentDates: {
      'ui:field': SafeArrayField,
      'ui:options': {
        itemName: 'Treatment Date',
        viewField: DateRangeView,
        customTitle: ' ',
        useDlWrap: true,
        keepInPageOnReview: true,
        doNotScroll: true,
        confirmRemove: true,
        confirmRemoveDescription:
          'Are you sure you want to remove this treatment date?',
      },
      items: {
        'ui:options': {
          classNames: 'vads-u-margin-left--1p5',
        },
        startDate: {
          ...currentOrPastDateUI('Start date of treatment'),
          'ui:required': () => true,
        },
        endDate: {
          ...currentOrPastDateUI('End date of treatment'),
          'ui:required': () => true,
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      hospitals: {
        type: 'array',
        minItems: 0,
        maxItems: 10,
        items: {
          type: 'object',
          properties: {
            hospitalName: textSchema,
            hospitalAddress: addressSchema(),
            connectedDisabilities: {
              type: 'string',
              maxLength: 500,
            },
          },
          required: ['hospitalName', 'hospitalAddress'],
        },
      },
      treatmentDates: {
        type: 'array',
        minItems: 0,
        maxItems: 10,
        items: {
          type: 'object',
          properties: {
            startDate: currentOrPastDateSchema,
            endDate: currentOrPastDateSchema,
          },
          required: ['startDate', 'endDate'],
        },
      },
    },
  },
};

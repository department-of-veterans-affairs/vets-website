import {
  addressUI,
  addressSchema,
} from 'platform/forms-system/src/js/web-component-patterns/addressPattern';

import {
  currentOrPastDateSchema,
  currentOrPastDateUI,
  inlineTitleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { DoctorView, DateRangeView } from '../components/viewElements';
import SafeArrayField from '../components/SafeArrayField';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...inlineTitleUI(
      'Recent Medical Care',
      'Your recent medical treatment continued.',
    ),
    doctors: {
      'ui:field': SafeArrayField,
      'ui:options': {
        itemName: 'Doctor',
        viewField: DoctorView,
        customTitle: 'Your doctors',
        useDlWrap: true,
        keepInPageOnReview: true,
        doNotScroll: true,
        confirmRemove: true,
        confirmRemoveDescription:
          'Are you sure you want to remove this doctor?',
        addAnotherText: 'Add another doctor',
      },
      items: {
        'ui:options': {
          classNames: 'vads-u-margin-left--1p5',
        },
        doctorName: {
          'ui:title': "Doctor's name",
        },
        doctorAddress: addressUI({
          labels: {
            militaryCheckbox: 'Doctor is on a military base',
          },
          omit: ['street2', 'street3'],
        }),
        connectedDisabilities: {
          'ui:title': 'Connected disabilities',
          'ui:description':
            'Please enter the service-connected disabilities this doctor treated you for (please separate each disability with a comma e.g., PTSD, Hearing Loss, Back Pain)',
        },
      },
    },

    // Treatment Dates Section
    importantDates: {
      'ui:field': SafeArrayField,
      'ui:options': {
        itemName: 'Date',
        viewField: DateRangeView,
        customTitle: 'Your important treatment dates',
        useDlWrap: true,
        keepInPageOnReview: true,
        doNotScroll: true,
        confirmRemove: true,
        confirmRemoveDescription: 'Are you sure you want to remove this date?',
        addAnotherText: 'Add another treatment date',
      },
      items: {
        'ui:options': {
          classNames: 'vads-u-margin-left--1p5',
        },
        startDate: currentOrPastDateUI('Start date'),
        endDate: currentOrPastDateUI('End date (if applicable)'),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      // Doctor and Hospital Schema
      doctors: {
        type: 'array',
        minItems: 0,
        maxItems: 2,
        items: {
          type: 'object',
          properties: {
            doctorName: {
              type: 'string',
              maxLength: 100,
            },
            doctorAddress: addressSchema(),
            connectedDisabilities: {
              type: 'string',
              maxLength: 500,
            },
          },
          required: ['doctorName', 'doctorAddress', 'connectedDisabilities'],
        },
      },

      // Treatment Dates Schema
      importantDates: {
        type: 'array',
        minItems: 1,
        maxItems: 2,
        items: {
          type: 'object',
          properties: {
            startDate: currentOrPastDateSchema,
            endDate: currentOrPastDateSchema,
          },
          required: ['startDate'],
        },
      },
    },
  },
};

import {
  addressUI,
  addressSchema,
} from 'platform/forms-system/src/js/web-component-patterns/addressPattern';

import {
  currentOrPastDateSchema,
  currentOrPastDateUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  DoctorView,
  HospitalView,
  DateRangeView,
} from '../components/viewElements';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Recent Medical Care',
      'Please provide information about doctors who have treated you and when. Additional dates can be added in Section 5 - Remarks.',
    ),
    doctors: {
      'ui:options': {
        itemName: 'Doctor',
        viewField: DoctorView,
        customTitle: 'Your doctors',
        useDlWrap: true,
        keepInPageOnReview: true,
      /*  showSave: true,
        reviewMode: true,*/
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
        }),
      },
    },

    // Treatment Dates Section
    importantDates: {
      'ui:options': {
        itemName: 'Date',
        viewField: DateRangeView,
        customTitle: 'Your important treatment dates',
        useDlWrap: true,
        keepInPageOnReview: true,
       /* showSave: true,
        reviewMode: true,*/
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
        endDate: {
          ...currentOrPastDateUI('End date (if applicable)'),
          'ui:required': () => false,
        },
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
          },
          required: ['doctorName', 'doctorAddress'],
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
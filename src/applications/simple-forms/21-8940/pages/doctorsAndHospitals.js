import {
  addressUI,
  addressSchema,
} from 'platform/forms-system/src/js/web-component-patterns/addressPattern';

import { DoctorView, HospitalView } from '../components/viewElements';

/** @type {PageSchema} */
export default {
  uiSchema: {
    doctors: {
      'ui:options': {
        itemName: 'Doctor',
        viewField: DoctorView,
        customTitle: 'Your doctors',
        useDlWrap: true,
        keepInPageOnReview: true,
        showSave: true,
        reviewMode: true,
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
    hospitals: {
      'ui:options': {
        itemName: 'Hospital',
        viewField: HospitalView,
        customTitle: 'Your hospitals',
        useDlWrap: true,
        keepInPageOnReview: true,
        showSave: true,
        reviewMode: true,
        doNotScroll: true,
        confirmRemove: true,
        confirmRemoveDescription:
          'Are you sure you want to remove this hospital?',
        addAnotherText: 'Add another hospital',
      },
      items: {
        'ui:options': {
          classNames: 'vads-u-margin-left--1p5',
        },
        hospitalName: {
          'ui:title': 'Hospital name',
        },
        hospitalAddress: addressUI({
          labels: {
            militaryCheckbox: 'Hospital is on a military base',
          },
        }),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
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
      hospitals: {
        type: 'array',
        minItems: 0,
        maxItems: 2,
        items: {
          type: 'object',
          properties: {
            hospitalName: {
              type: 'string',
              maxLength: 100,
            },
            hospitalAddress: addressSchema(),
          },
          required: ['hospitalName', 'hospitalAddress'],
        },
      },
    },
  },
};

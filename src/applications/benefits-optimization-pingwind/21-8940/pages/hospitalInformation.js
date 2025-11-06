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
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { HospitalView, DateRangeView } from '../components/viewElements';
import SafeArrayField from '../components/SafeArrayField';

const hospitalTypeLabels = {
  va: 'VA Hospital',
  nonVa: 'Non-VA Hospital',
};

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
        hospitalType: {
          ...radioUI({
            title: 'Hospital type',
            labels: hospitalTypeLabels,
            required: () => true,
            errorMessages: {
              required: 'Please select if this is a VA or Non-VA hospital.',
            },
            tile: true,
          }),
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
          'ui:description':
            'Please enter the service-connected disabilities this doctor treated you for (please separate each disability with a comma e.g., PTSD, Hearing Loss, Back Pain).',
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
            hospitalType: radioSchema(Object.keys(hospitalTypeLabels)),
            hospitalName: textSchema,
            hospitalAddress: addressSchema(),
            connectedDisabilities: {
              type: 'string',
              maxLength: 500,
            },
          },
          required: [
            'hospitalType',
            'hospitalName',
            'hospitalAddress',
            'connectedDisabilities',
          ],
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

/**
 * @module config/form/pages/employment-last-payment
 * @description Standard form system configuration for Employment Last Payment page
 * VA Form 21-4192 - Request for Employment Information
 */

import {
  currentOrPastDateSchema,
  currencyUI,
  currencySchema,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { MemorableDateUI } from '../components/memorable-date-ui';

// Constants for required fields
const BASIC_REQUIRED_FIELDS = [
  'dateOfLastPayment',
  'grossAmountLastPayment',
  'lumpSumPayment',
];

const LUMP_SUM_REQUIRED_FIELDS = [
  ...BASIC_REQUIRED_FIELDS,
  'grossAmountPaid',
  'datePaid',
];

/**
 * uiSchema for Employment Last Payment page
 * Collects information about the last payment received
 */
export const employmentLastPaymentUiSchema = {
  'ui:title': 'Last payment',
  employmentLastPayment: {
    dateOfLastPayment: MemorableDateUI({
      title: 'Date of last payment',
      errorMessages: {
        required: 'Date of last payment is required',
      },
    }),
    grossAmountLastPayment: currencyUI({
      title: 'Gross amount of last payment',
      errorMessages: {
        required: 'Gross amount of last payment is required',
        min: 'Gross amount must be at least $0',
      },
    }),
    lumpSumPayment: radioUI({
      title: 'Was an additional lump sum payment made?',
      hint:
        'A lump sum is a one-off payment for a specific purpose such as a severance package or payout of unused leave.',
      labels: {
        yes: 'Yes',
        no: 'No',
      },
      errorMessages: {
        required: 'Please select Yes or No',
      },
    }),
    grossAmountPaid: currencyUI({
      title: 'Gross amount paid',
      errorMessages: {
        required: 'Gross amount paid is required',
        min: 'Gross amount must be at least $0',
      },
      expandUnder: 'lumpSumPayment',
      expandUnderCondition: value => value === 'yes',
      required: formData =>
        formData?.employmentLastPayment?.lumpSumPayment === 'yes',
    }),
    datePaid: MemorableDateUI({
      title: 'Date of lump sum payment',
      errorMessages: {
        required: 'Date lump sum was paid is required',
      },
      expandUnder: 'lumpSumPayment',
      expandUnderCondition: value => value === 'yes',
      required: formData =>
        formData?.employmentLastPayment?.lumpSumPayment === 'yes',
    }),
  },
  'ui:options': {
    updateSchema: (formData, formSchema) => {
      const lumpSumPayment = formData?.employmentLastPayment?.lumpSumPayment;
      const requiredFields =
        lumpSumPayment === 'yes'
          ? LUMP_SUM_REQUIRED_FIELDS
          : BASIC_REQUIRED_FIELDS;

      return {
        ...formSchema,
        properties: {
          ...formSchema.properties,
          employmentLastPayment: {
            ...formSchema.properties.employmentLastPayment,
            required: requiredFields,
          },
        },
      };
    },
  },
};

/**
 * JSON Schema for Employment Last Payment page
 * Validates last payment fields
 */
export const employmentLastPaymentSchema = {
  type: 'object',
  required: ['employmentLastPayment'],
  properties: {
    employmentLastPayment: {
      type: 'object',
      required: BASIC_REQUIRED_FIELDS,
      properties: {
        dateOfLastPayment: currentOrPastDateSchema,
        grossAmountLastPayment: currencySchema,
        lumpSumPayment: radioSchema(['yes', 'no']),
        grossAmountPaid: currencySchema,
        datePaid: currentOrPastDateSchema,
      },
    },
  },
};

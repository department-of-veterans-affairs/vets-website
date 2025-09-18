import React from 'react';
import { radioUI } from 'platform/forms-system/src/js/web-component-patterns';

// Keep labels as a simple value -> text map
const YES_NO_UNKNOWN_LABELS = {
  yes: 'Yes',
  no: 'No',
  unknown: 'I don’t know',
};

const VALUES = Object.keys(YES_NO_UNKNOWN_LABELS);

const CapitalCrimeInfo = () => (
  <va-additional-info trigger="Learn more about capital crimes">
    <p className="vads-u-margin--0">
      A capital crime is a serious offense that can be punished by life in
      prison or the death penalty.
    </p>
  </va-additional-info>
);

/** @type {PageSchema} */
const federalLawDetails = {
  path: 'federal-law-details',
  title: 'Federal law details',
  uiSchema: {
    'ui:title': 'Federal law details',
    sexualOffense: {
      ...radioUI({
        title: 'Has the deceased committed a sexual offense?',
        labels: YES_NO_UNKNOWN_LABELS,
        errorMessages: { required: 'Select an option' },
      }),
    },
    capitalCrime: {
      ...radioUI({
        title: 'Has the deceased committed a capital crime?',
        labels: YES_NO_UNKNOWN_LABELS,
        errorMessages: { required: 'Select an option' },
      }),
    },
    'view:capitalCrimeInfo': {
      'ui:field': () => <CapitalCrimeInfo />,
    },
    'ui:order': ['sexualOffense', 'capitalCrime', 'view:capitalCrimeInfo'],
  },
  schema: {
    type: 'object',
    required: ['sexualOffense', 'capitalCrime'],
    properties: {
      sexualOffense: {
        type: 'string',
        enum: VALUES,
        enumNames: VALUES.map(v => YES_NO_UNKNOWN_LABELS[v]),
      },
      capitalCrime: {
        type: 'string',
        enum: VALUES,
        enumNames: VALUES.map(v => YES_NO_UNKNOWN_LABELS[v]),
      },
      'view:capitalCrimeInfo': { type: 'object', properties: {} },
    },
  },
};

export default federalLawDetails;

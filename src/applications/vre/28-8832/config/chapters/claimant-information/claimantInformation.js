import React from 'react';
import merge from 'lodash/merge';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { hasSession } from 'platform/user/profile/utilities';
import { claimantInformation } from '../../utilities';

export const schema = claimantInformation;

export const uiSchema = {
  fullName: {
    first: {
      'ui:title': 'First name',
      'ui:required': () => !hasSession(),
    },
    middle: {
      'ui:title': 'Middle name',
    },
    last: {
      'ui:title': 'Last name',
      'ui:required': () => !hasSession(),
    },
    suffix: {
      'ui:title': 'Suffix',
      'ui:options': {
        widgetClassNames: 'usa-input-medium',
      },
    },
  },
  ssn: {
    ...ssnUI,
    'ui:required': () => !hasSession(),
  },
  VAFileNumber: {
    'ui:title': (
      <p className="vads-u-margin--0 vads-u-margin-top--3 vads-u-display--inline-block vads-u-font-weight--normal vads-u-color--base vads-u-font-family--sans vads-u-font-size--base">
        Your VA file number{' '}
        <span className="schemaform-required-span">(*If known)</span>
      </p>
    ),
    'ui:options': {
      widgetClassNames: 'usa-input-medium',
    },
    'ui:errorMessages': {
      pattern: 'Please enter a valid VA file number',
    },
  },
  dateOfBirth: merge(currentOrPastDateUI('Date of birth'), {
    'ui:required': () => !hasSession(),
  }),
};

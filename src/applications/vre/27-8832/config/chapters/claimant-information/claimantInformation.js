import React from 'react';
import merge from 'lodash/merge';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { claimantInformation } from '../../utilities';

export const schema = claimantInformation;

export const uiSchema = {
  fullName: {
    first: {
      'ui:title': 'First name',
      'ui:required': () => true,
    },
    middle: {
      'ui:title': 'Middle name',
      'ui:options': {
        hideEmptyValueInReview: true,
      },
    },
    last: {
      'ui:title': 'Last name',
      'ui:required': () => true,
    },
    suffix: {
      'ui:title': 'Suffix',
      'ui:options': {
        widgetClassNames: 'usa-input-medium',
        hideEmptyValueInReview: true,
      },
    },
  },
  ssn: {
    ...ssnUI,
    'ui:required': () => true,
  },
  VAFileNumber: {
    'ui:title': (
      <p className="vads-u-margin--0 vads-u-margin-top--3 vads-u-display--inline-block vads-u-font-weight--normal vads-u-color--base vads-u-font-family--sans vads-u-font-size--base">
        Your VA file number{' '}
        <span>
          (*You must enter either a VA file number or Social Security number)
        </span>
      </p>
    ),
    'ui:options': {
      widgetClassNames: 'usa-input-medium',
      hideEmptyValueInReview: true,
    },
    'ui:errorMessages': {
      pattern: 'Enter a valid VA file number',
    },
  },
  dateOfBirth: merge(currentOrPastDateUI('Date of birth'), {
    'ui:required': () => true,
  }),
};

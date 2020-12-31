import React from 'react';
import merge from 'lodash/merge';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { hasSession } from 'platform/user/profile/utilities';
import { claimantInformation } from '../../utilities';
import { LOA_LEVEL_REQUIRED } from '../../../constants';

export const schema = claimantInformation;

export const uiSchema = {
  fullName: {
    first: {
      'ui:title': 'First name',
      'ui:required': formData =>
        !hasSession() || formData.loa !== LOA_LEVEL_REQUIRED,
    },
    middle: {
      'ui:title': 'Middle name',
      'ui:options': {
        hideEmptyValueInReview: true,
      },
    },
    last: {
      'ui:title': 'Last name',
      'ui:required': formData =>
        !hasSession() || formData.loa !== LOA_LEVEL_REQUIRED,
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
    'ui:required': formData =>
      !hasSession() || formData.loa !== LOA_LEVEL_REQUIRED,
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
      hideEmptyValueInReview: true,
    },
    'ui:errorMessages': {
      pattern: 'Please enter a valid VA file number',
    },
  },
  dateOfBirth: merge(currentOrPastDateUI('Date of birth'), {
    'ui:required': formData =>
      !hasSession() || formData.loa !== LOA_LEVEL_REQUIRED,
  }),
};

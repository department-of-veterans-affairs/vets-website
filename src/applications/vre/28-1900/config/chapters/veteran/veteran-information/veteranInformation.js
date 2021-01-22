import React from 'react';
import fullSchema from 'vets-json-schema/dist/28-1900-schema.json';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';

const { veteranInformation } = fullSchema.properties;

export const schema = {
  type: 'object',
  properties: {
    veteranInformation,
  },
};

export const uiSchema = {
  veteranInformation: {
    'ui:title': 'Veteran Information',
    fullName: {
      first: {
        'ui:title': 'Your first name',
        'ui:required': () => true,
      },
      middle: {
        'ui:title': 'Your middle name',
        'ui:options': {
          hideEmptyValueInReview: true,
        },
      },
      last: {
        'ui:title': 'Your last name',
        'ui:required': () => true,
      },
      suffix: {
        'ui:title': 'Suffix',
        'ui:options': {
          widgetClassNames: 'form-select-medium',
          hideEmptyValueInReview: true,
        },
      },
    },
    ssn: {
      'ui:title': 'Your Social Security number',
      'ui:required': () => true,
      ...ssnUI,
    },
    vaFileNumber: {
      'ui:title': (
        <p className="vads-u-margin--0 vads-u-margin-top--3 vads-u-display--inline-block vads-u-font-weight--normal vads-u-color--base vads-u-font-family--sans vads-u-font-size--base">
          Your VA file number{' '}
          <span className="schemaform-required-span">
            (only if different than your{' '}
            <dfn>
              <abbr title="social security number">SSN</abbr>
            </dfn>
            )
          </span>
        </p>
      ),
      'ui:options': {
        widgetClassNames: 'usa-input-medium',
        hideEmptyValueInReview: true,
      },
    },
    dob: {
      ...currentOrPastDateUI('Date of birth'),
      'ui:required': () => true,
    },
  },
};

import React from 'react';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';

export const schema = {
  personalInformation: {
    type: 'object',
    properties: {
      firstName: {
        type: 'string',
      },
      middleName: {
        type: 'string',
      },
      lastName: {
        type: 'string',
      },
      suffix: {
        type: 'string',
      },
      birthDate: {
        type: 'string',
        pattern: '^\\d{4}-\\d{2}-\\d{2}$',
      },
      ssn: {
        type: 'string',
      },
    },
  },
};

export const uiSchema = {
  personalInformation: {
    firstName: {
      'ui:title': 'First name',
      'ui:errorMessages': {
        required: 'Please enter your first name.',
      },
      'ui:required': () => {
        return true;
      },
    },
    middleName: {
      'ui:title': 'Middle name',
    },
    lastName: {
      'ui:title': 'Last name',
      'ui:errorMessages': {
        required: 'Please enter your last name.',
      },
      'ui:required': () => {
        return true;
      },
    },
    suffix: {
      'ui:title': 'Spouse’s suffix',
      'ui:options': {
        widgetClassNames: 'form-select-medium',
      },
    },
    birthDate: {
      'ui:title': 'Date of birth',
      'ui:description': () => (
        <span>
          <b>Note: </b>
          Your date of birth helps us match your information to your Veteran
          records. We can then share your vaccine plans with your local VA
          health facility so they can contact you when you’re eligible to get a
          vaccine.
        </span>
      ),
      'ui:widget': 'date',
      'ui:required': () => {
        return true;
      },
    },
    ssn: {
      ...ssnUI,
      ...{
        'ui:title': 'Social Security number (SSN)',
        'ui:description': () => (
          <span>
            <b>Note: </b>
            Your <abbr title="Social Security Number">SSN</abbr> helps us match
            your information to your Veteran records. We can then share your
            vaccine plans with your local VA health facility so they can contact
            you when you’re eligible to get a vaccine.
          </span>
        ),
        'ui:errorMessages': {
          pattern: 'Please enter a valid 9 digit SSN (dashes allowed)',
          required: 'Please enter a SSN',
        },
        'ui:required': () => {
          return true;
        },
      },
    },
  },
};

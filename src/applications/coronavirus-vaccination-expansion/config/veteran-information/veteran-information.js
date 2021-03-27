import React from 'react';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import { veteranInformation } from '../schema-imports';

export const schema = {
  veteranInformation,
};

export const uiSchema = {
  veteranInformation: {
    veteranBirthDate: {
      'ui:title': 'Date of birth',
      'ui:description': () => (
        <span>
          <strong>Note: </strong>
          The Veteran's date of birth helps us match your information to your
          Veteran's records. We can then share your vaccine plans with your
          local VA health facility so they can contact you when you’re eligible
          to get a vaccine.
        </span>
      ),
      'ui:widget': 'date',
    },
    veteranSsn: {
      ...ssnUI,
      ...{
        'ui:title': 'Social Security number (SSN)',
        'ui:description': () => (
          <span>
            <strong>Note: </strong>
            The Veteran's <abbr title="Social Security Number">SSN</abbr> helps
            us match your information to your Veteran's records. We can then
            share your vaccine plans with your local VA health facility so they
            can contact you when you’re eligible to get a vaccine.
          </span>
        ),
        'ui:errorMessages': {
          pattern: 'Please enter a valid 9 digit SSN (dashes allowed)',
          required: 'Please enter a SSN',
        },
      },
    },
  },
};

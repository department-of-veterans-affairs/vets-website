import React from 'react';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import { veteranInformation } from '../schema-imports';

export const schema = {
  veteranInformation,
};

export const uiSchema = {
  veteranInformation: {
    veteranBirthDate: {
      'ui:title': "Veteran's date of birth",
      'ui:description': () => (
        <p>
          <strong>Note: </strong>
          The Veteran’s date of birth helps us match your information to the
          Veteran’s records. This helps us confirm your eligibility.
        </p>
      ),
      'ui:widget': 'date',
    },
    veteranSsn: {
      ...ssnUI,
      ...{
        'ui:title': "Veteran's Social Security number (SSN)",
        'ui:description': () => (
          <p>
            <strong>Note: </strong>
            The Veteran’s <abbr title="Social Security Number">SSN</abbr> helps
            us match your information to the Veteran’s records. This helps us
            confirm your eligibility.
          </p>
        ),
        'ui:errorMessages': {
          pattern: 'Please enter a valid 9 digit SSN (dashes allowed)',
          required: 'Please enter a SSN',
        },
      },
    },
  },
};

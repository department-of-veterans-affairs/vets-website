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
      birthDate: {
        type: 'string',
        pattern: '^\\d{4}-\\d{2}-\\d{2}$',
      },
      birthSex: {
        type: 'string',
        enum: ['Male', 'Female', 'Prefer not to answer'],
      },
      ssn: {
        type: 'string',
      },
    },
    required: ['firstName', 'lastName', 'birthDate', 'ssn'],
  },
};

export const uiSchema = {
  personalInformation: {
    firstName: {
      'ui:title': 'First name',
      'ui:errorMessages': {
        required: 'Please enter your first name.',
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
    },
    birthDate: {
      'ui:title': 'Date of birth',
      'ui:description': () => (
        <span>
          <strong>Note: </strong>
          Your date of birth helps us match your information to your Veteran
          records. We can then share your vaccine plans with your local VA
          health facility so they can contact you when you’re eligible to get a
          vaccine.
        </span>
      ),
      'ui:widget': 'date',
    },
    birthSex: {
      'ui:title': 'What sex were you assigned at birth?',
      'ui:widget': 'radio',
      'ui:description': (
        <>
          <p>
            <strong>Note:</strong>
            We ask for this information to help us and our partners at the
            Centers for Disease Control and Prevention (CDC) understand who is
            getting vaccines. This helps us serve all eligible Veterans and
            family members better. If you choose to answer, we’ll add this
            information to your VA health record. We’ll also share this
            information with the CDC, but we won’t link it to your name.
          </p>
        </>
      ),
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
      },
    },
  },
};

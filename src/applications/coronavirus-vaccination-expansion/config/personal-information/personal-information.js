import React from 'react';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import { personalInformation } from '../schema-imports';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';

export const schema = {
  personalInformation,
};

export const uiSchema = {
  personalInformation: {
    firstName: {
      'ui:title': 'Your first name',
      'ui:errorMessages': {
        required: 'Please enter your first name.',
      },
    },
    middleName: {
      'ui:title': 'Your middle name',
    },
    lastName: {
      'ui:title': 'Your last name',
      'ui:errorMessages': {
        required: 'Please enter your last name.',
      },
    },
    birthDate: {
      ...currentOrPastDateUI('Your date of birth'),
      'ui:description': () => (
        <p>
          <strong>Note: </strong>
          We ask for your date of birth to add you to our records and confirm
          your eligibility for a vaccine.
        </p>
      ),
      'ui:errorMessages': {
        pattern: 'Please enter your complete birthday',
        required: 'Please enter your date of birth',
      },
    },
    birthSex: {
      'ui:title': 'What sex were you assigned at birth?',
      'ui:widget': 'radio',
      'ui:description': (
        <>
          <p>
            <strong>Note: </strong>
            We ask for this information to help us and our partners at the
            Centers for Disease Control and Prevention (CDC) understand who is
            getting vaccines. If you choose to answer, we’ll add this
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
          <p>
            <strong>Note: </strong>
            We ask for your <abbr title="Social Security Number">SSN</abbr> to
            add you to our records and confirm your eligibility for a vaccine.
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

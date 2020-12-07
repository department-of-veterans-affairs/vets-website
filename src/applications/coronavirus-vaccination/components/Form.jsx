import React, { useState } from 'react';
import { withRouter } from 'react-router';

import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';

const schema = {
  type: 'object',
  required: [
    'firstName',
    'lastName',
    'emailAddress',
    'phone',
    'dateOfBirth',
    'vaxPreference',
  ],
  properties: {
    firstName: {
      type: 'string',
    },
    lastName: {
      type: 'string',
    },
    dateOfBirth: {
      type: 'string',
    },
    ssn: {
      type: 'string',
      pattern: '^\\d{3}-?\\d{2}-?\\d{4}$',
    },
    emailAddress: {
      type: 'string',
      format: 'email',
    },
    phone: {
      type: 'string',
      pattern: '\\(?\\d{3}\\)?-?\\d{3}-?\\d{4}$',
    },

    vaxPreference: {
      type: 'string',
      enum: ['INTERESTED', 'NOT_INTERESTED', 'UNDECIDED', 'ALREADY_VACCINATED'],
    },
  },
};

const uiSchema = {
  firstName: {
    'ui:title': 'First name',
    'ui:errorMessages': {
      required: 'Please enter your first name.',
    },
  },
  lastName: {
    'ui:title': 'Last name',
    'ui:errorMessages': {
      required: 'Please enter your last name.',
    },
  },
  dateOfBirth: {
    'ui:title': 'Date of birth',
    'ui:widget': 'date',
    'ui:errorMessages': {
      required: 'Please enter your date of birth.',
    },
  },
  ssn: {
    'ui:title': 'Social Security Number (SSN)',
    'ui:errorMessages': {
      required: 'Please enter your social security number.',
      pattern: 'Please enter a valid social security number.',
    },
  },
  emailAddress: {
    'ui:title': 'Email address',
    'ui:errorMessages': {
      required: 'Please enter your email address, using this format: X@X.com',
      pattern:
        'Please enter your email address again, using this format: X@X.com',
    },
  },
  phone: {
    'ui:title': 'Phone',
    'ui:errorMessages': {
      required: 'Please enter your phone number',
      pattern: 'Please enter a valid phone number',
    },
  },
  vaxPreference: {
    'ui:title': 'Interested in vaccine',
    'ui:widget': 'radio',
    'ui:errorMessages': {
      required: 'Please select an answer.',
    },
    'ui:options': {
      labels: {
        INTERESTED: 'Interested',
        NOT_INTERESTED: 'Not interested',
        UNDECIDED: 'Unsure',
        ALREADY_VACCINATED: 'Already received a vaccination',
      },
      classNames: '',
    },
  },
};

function Form({ router }) {
  const [formData, setFormData] = useState({});
  const onSubmit = _submittedFormData => {
    // console.log(submittedFormData);
    router.replace('/confirmation');
  };

  return (
    <SchemaForm
      // "name" and "title" are used only internally to SchemaForm
      name="Coronavirus vaccination"
      title="Coronavirus vaccination"
      schema={schema}
      uiSchema={uiSchema}
      onChange={setFormData}
      onSubmit={onSubmit}
      data={formData}
    >
      <button type="submit" className="usa-button">
        Apply
      </button>
    </SchemaForm>
  );
}

export default withRouter(Form);

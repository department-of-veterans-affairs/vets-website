import React, { useState } from 'react';
import { withRouter } from 'react-router';

import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';

const schema = {
  type: 'object',
  required: ['firstName', 'lastName', 'emailAddress', 'dateOfBirth'],
  properties: {
    firstName: {
      type: 'string',
    },
    lastName: {
      type: 'string',
    },
    emailAddress: {
      type: 'string',
    },
    dateOfBirth: {
      type: 'string',
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
  emailAddress: {
    'ui:title': 'Email address',
    'ui:errorMessages': {
      required: 'Please enter your email address, using this format: X@X.com',
      pattern:
        'Please enter your email address again, using this format: X@X.com',
    },
  },
  dateOfBirth: {
    'ui:title': 'Date of birth',
    'ui:widget': 'date',
    'ui:errorMessages': {
      required: 'Please enter your date of birth.',
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

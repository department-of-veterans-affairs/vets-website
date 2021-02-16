import React from 'react';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';

function ViewDependentsChildForm() {
  const schema = {
    type: 'object',
    properties: {
      firstName: {
        type: 'string',
      },
    },
  };

  const uiSchema = {
    firstName: {
      'ui:title': 'First Name',
    },
  };

  function show() {}

  return (
    <SchemaForm
      name="View Dependents Child Form"
      title=""
      schema={schema}
      uiSchema={uiSchema}
      onSubmit={show}
    />
  );
}

export default ViewDependentsChildForm;

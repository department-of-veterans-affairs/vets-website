import React from 'react';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';

function ViewDependentsSpouseForm() {
  const schema = {
    type: 'object',
    properties: {
      ssn: {
        type: 'string',
      },
    },
  };

  const uiSchema = {
    ssn: {
      'ui:title': 'Social Security Number',
    },
  };

  function show() {}

  return (
    <SchemaForm
      name="View Dependents Spouse Form"
      title=""
      schema={schema}
      uiSchema={uiSchema}
      onSubmit={show}
    />
  );
}

export default ViewDependentsSpouseForm;

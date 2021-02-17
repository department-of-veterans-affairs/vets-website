import React from 'react';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';

import { SCHEMAS } from '../schemas';

const ManageDependents = props => {
  const { relationship } = props;

  const onSubmit = () => {};

  const onChange = () => {};

  return (
    <div>
      <SchemaForm
        name="Remove Dependent"
        title="Remove Dependent from award"
        schema={SCHEMAS?.[relationship]?.schema || {}}
        uiSchema={SCHEMAS?.[relationship]?.uiSchema || {}}
        onSubmit={onSubmit}
        onChange={onChange}
      />
    </div>
  );
};

export default ManageDependents;

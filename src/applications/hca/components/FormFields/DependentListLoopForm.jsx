import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';

import {
  dependentSchema as schema,
  dependentUISchema as uiSchema,
} from '../../definitions/dependent';

const DependentListLoopForm = props => {
  const { children, data, page, onChange, onSubmit } = props;

  // build the uiSchema title attribute based on available form data
  const currentUISchema = useMemo(
    () => {
      const { fullName = {} } = data || {};
      const name =
        page.id !== 'basic'
          ? `${fullName.first} ${fullName.last}`
          : 'Dependent';
      return {
        ...uiSchema[page.id],
        'ui:title': `${name} - ${page.title}`,
      };
    },
    [page, data],
  );

  return (
    <>
      <SchemaForm
        name="Dependent"
        title="Dependent"
        data={data}
        uiSchema={currentUISchema}
        schema={schema[page.id]}
        onSubmit={onSubmit}
        onChange={onChange}
      >
        {children}
      </SchemaForm>
    </>
  );
};

DependentListLoopForm.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  data: PropTypes.object,
  page: PropTypes.object,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default DependentListLoopForm;

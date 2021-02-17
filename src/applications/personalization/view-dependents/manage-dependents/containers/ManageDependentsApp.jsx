import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import * as actions from '../redux/actions';
import { SCHEMAS } from '../schemas';

const ManageDependents = props => {
  const { relationship, updateFormData, formState } = props;
  const [schema, setSchema] = useState(null);
  const [uiSchema, setUiSchema] = useState(null);
  const onSubmit = () => {};

  const onChange = nextFormData => {
    updateFormData(formState.formSchema, formState.uiSchema, nextFormData);
  };

  useEffect(
    () => {
      // on first load, setup the things.
      if (relationship && !formState) {
        const initialSchema = SCHEMAS[relationship].schema;
        const initialUiSchema = SCHEMAS[relationship].uiSchema;
        updateFormData(initialSchema, initialUiSchema, {});
        setSchema(initialSchema);
        setUiSchema(initialUiSchema);
      }
    },
    [relationship, formState],
  );

  return schema ? (
    <div>
      <SchemaForm
        name="Remove Dependent"
        title="Remove Dependent from award"
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
        onChange={onChange}
      />
    </div>
  ) : null;
};

const mapStateToProps = state => ({
  formState: state.removeDependent.formState,
});

const mapDispatchToProps = {
  updateFormData: actions.updateFormData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ManageDependents);
export { ManageDependents };

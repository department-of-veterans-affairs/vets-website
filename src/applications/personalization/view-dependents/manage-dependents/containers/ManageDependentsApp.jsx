import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';
import * as actions from '../redux/actions';
import { SCHEMAS } from '../schemas';

const ManageDependents = props => {
  const {
    relationship,
    updateFormData,
    formState,
    cleanupFormData,
    closeFormHandler,
  } = props;
  const [schema, setSchema] = useState(null);
  const [uiSchema, setUiSchema] = useState(null);
  const onSubmit = () => {};

  const onChange = nextFormData => {
    updateFormData(formState.formSchema, formState.uiSchema, nextFormData);
  };

  const handleFormClose = () => {
    cleanupFormData();
    closeFormHandler();
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
        data={formState.formData}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
        onChange={onChange}
      >
        <div className="vads-l-row form-progress-buttons schemaform-buttons">
          <LoadingButton
            onClick={onSubmit}
            className="usa-button usa-button-primary"
            aria-label="Submit VA Form 686c to remove this dependent"
          >
            Remove dependent
          </LoadingButton>
          <button
            onClick={handleFormClose}
            className="usa-button usa-button-secondary"
          >
            Cancel
          </button>
        </div>
      </SchemaForm>
    </div>
  ) : null;
};

const mapStateToProps = state => ({
  formState: state.removeDependent.formState,
});

const mapDispatchToProps = {
  updateFormData: actions.updateFormData,
  cleanupFormData: actions.cleanupFormData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ManageDependents);
export { ManageDependents };

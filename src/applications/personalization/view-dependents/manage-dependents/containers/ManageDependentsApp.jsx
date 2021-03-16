import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';
import * as actions from '../redux/actions';
import { SCHEMAS } from '../schemas';

const ManageDependents = props => {
  const {
    relationship,
    updateFormData,
    dependentsState,
    cleanupFormData,
    closeFormHandler,
    stateKey,
  } = props;
  const [schema, setSchema] = useState(null);
  const [uiSchema, setUiSchema] = useState(null);
  const onSubmit = () => {};

  const onChange = useCallback(
    nextFormData => {
      updateFormData(
        dependentsState[stateKey].formSchema,
        dependentsState[stateKey].uiSchema,
        nextFormData,
        stateKey,
      );
    },
    [dependentsState],
  );

  const handleFormClose = () => {
    cleanupFormData(stateKey);
    closeFormHandler();
  };

  const initialize = () => {
    if (relationship) {
      // grab the schemas needed
      const initialSchema = SCHEMAS[relationship].schema;
      const initialUiSchema = SCHEMAS[relationship].uiSchema;
      // setup initial redux state
      updateFormData(initialSchema, initialUiSchema, {}, stateKey);
      // setup local app state
      setSchema(initialSchema);
      setUiSchema(initialUiSchema);
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  useEffect(
    () => {
      if (dependentsState?.[stateKey]) {
        setSchema(dependentsState[stateKey].formSchema);
        setUiSchema(dependentsState[stateKey].uiSchema);
      }
    },
    [dependentsState],
  );

  return schema ? (
    <div>
      <SchemaForm
        name="Remove Dependent"
        title="Remove Dependent from award"
        schema={schema}
        data={dependentsState[stateKey].formData}
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
            type="button"
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
  dependentsState: state.removeDependents.dependentsState,
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

ManageDependents.propTypes = {
  relationship: PropTypes.string,
  updateFormData: PropTypes.func,
  dependentsState: PropTypes.object,
  cleanupFormData: PropTypes.func,
  closeFormHandler: PropTypes.func,
  stateKey: PropTypes.number,
};

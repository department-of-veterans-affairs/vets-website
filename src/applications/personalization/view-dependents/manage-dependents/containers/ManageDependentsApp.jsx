import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';
import ErrorMessage from 'platform/forms/components/common/alerts/ErrorMessage';
import * as actions from '../redux/actions';
import { SCHEMAS } from '../schemas';
import {
  transformForSubmit,
  ServerErrorFragment,
  LOADING_STATUS,
} from '../utils';

const ManageDependents = props => {
  const {
    relationship,
    updateFormData,
    cleanupFormData,
    submitFormData,
    dependentsState,
    closeFormHandler,
    stateKey,
    userInfo,
  } = props;
  const [schema, setSchema] = useState(null);
  const [uiSchema, setUiSchema] = useState(null);

  const onSubmit = formState => {
    const { veteranContactInformation } = props;
    const payload = transformForSubmit(
      formState.formData,
      veteranContactInformation,
      userInfo,
    );
    submitFormData(stateKey, payload).then(data => {
      if (data.status === LOADING_STATUS.success) {
        closeFormHandler();
      }
    });
  };

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

  useEffect(() => {
    if (dependentsState?.[stateKey]) {
      setSchema(dependentsState[stateKey].formSchema);
      setUiSchema(dependentsState[stateKey].uiSchema);
    }
  }, [dependentsState, stateKey]);

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
          {dependentsState[stateKey].status === LOADING_STATUS.failed && (
            <ErrorMessage active>
              <ServerErrorFragment />
            </ErrorMessage>
          )}
          <LoadingButton
            className="usa-button usa-button-primary"
            aria-label="Submit VA Form 686c to remove this dependent"
            isLoading={
              dependentsState[stateKey].status === LOADING_STATUS.pending
            }
            loadingText="Removing dependent from award..."
            disabled={
              dependentsState[stateKey].status === LOADING_STATUS.pending
            }
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
  ) : (
    <va-loading-indicator message="Loading the form..." />
  );
};

const mapStateToProps = state => ({
  dependentsState: state?.removeDependents?.dependentsState,
  veteranContactInformation: state?.user?.profile?.vapContactInfo,
});

const mapDispatchToProps = {
  ...actions,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDependents);
export { ManageDependents };

ManageDependents.propTypes = {
  cleanupFormData: PropTypes.func,
  closeFormHandler: PropTypes.func,
  dependentsState: PropTypes.object,
  relationship: PropTypes.string,
  stateKey: PropTypes.number,
  updateFormData: PropTypes.func,
  userInfo: PropTypes.object,
  veteranContactInformation: PropTypes.object,
};

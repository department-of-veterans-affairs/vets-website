import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import ErrorMessage from 'platform/forms/components/common/alerts/ErrorMessage';

import * as actions from '../redux/actions';
import { SCHEMAS } from '../schemas';
import {
  transformForSubmit,
  ServerErrorFragment,
  LOADING_STATUS,
} from '../utils';

/**
 * @typedef {Object} ManageDependentsProps
 * @property {string} relationship - dependent's relationship to user
 * @property {function} updateFormData - action to update form data in redux
 * @property {function} cleanupFormData - action to clean up form data in redux
 * @property {function} submitFormData - action to submit form data
 * @property {object} dependentsState - redux state for manage dependents forms
 * @property {function} closeFormHandler - handler to close the manage
 * dependents form
 * @property {number} stateKey - index key for dependent
 * @property {object} userInfo - user information from profile
 *
 * @param {ManageDependentsProps} props - component props
 * @returns {JSX.Element} - ManageDependents component
 */
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () => {
      if (dependentsState?.[stateKey]) {
        setSchema(dependentsState[stateKey].formSchema);
        setUiSchema(dependentsState[stateKey].uiSchema);
      }
    },
    [dependentsState, stateKey],
  );

  const fullName = `${userInfo.fullName?.firstName || ''} ${userInfo.fullName
    ?.lastName || ''}`;
  const isLoading = schema
    ? dependentsState[stateKey].status === LOADING_STATUS.pending
    : false;

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
          <va-button
            submit="prevent"
            label={`Submit VA Form 686c to remove ${fullName} as a dependent`}
            loading={
              dependentsState[stateKey].status === LOADING_STATUS.pending
                ? true
                : null
            }
            text={
              isLoading
                ? 'Removing dependent from award...'
                : 'Remove dependent'
            }
            disabled={isLoading || null}
          />
          <va-button
            onClick={handleFormClose}
            secondary
            text="Cancel"
            label={`Cancel removing ${fullName} as a dependent`}
          />
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ManageDependents);
export { ManageDependents };

ManageDependents.propTypes = {
  cleanupFormData: PropTypes.func,
  closeFormHandler: PropTypes.func,
  dependentsState: PropTypes.object,
  relationship: PropTypes.string,
  stateKey: PropTypes.number,
  submitFormData: PropTypes.func,
  updateFormData: PropTypes.func,
  userInfo: PropTypes.object,
  veteranContactInformation: PropTypes.object,
};

import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';

import * as VAP_SERVICE from 'platform/user/profile/vap-svc/constants';
import {
  updateFormFieldWithSchema,
  clearTransactionRequest,
} from '~/platform/user/profile/vap-svc/actions';

import { selectEditedFormField } from '~/platform/user/profile/vap-svc/selectors';

import VAPServiceEditModalErrorMessage from '~/platform/user/profile/vap-svc/components/base/VAPServiceEditModalErrorMessage';

import LoadingButton from '~/platform/site-wide/loading-button/LoadingButton';
import { useProfileTransaction } from '../hooks';

import ProfileInformationActionButtons from './ProfileInformationActionButtons';

const ProfileFormContainerVAFSC = ({
  fieldName,
  getInitialFormValues,
  onCancel,
  formRef,
  children,
}) => {
  const dispatch = useDispatch();

  const {
    isLoading,
    error,
    analyticsSectionName,
    uiSchema,
    formSchema,
    title,
    startTransaction,
  } = useProfileTransaction(fieldName);

  const formField = useSelector(state =>
    selectEditedFormField(state, fieldName),
  );

  const initialValues = useMemo(() => getInitialFormValues(), [
    getInitialFormValues,
  ]);

  const onMount = () => {
    dispatch(clearTransactionRequest(fieldName));
    dispatch(
      updateFormFieldWithSchema(fieldName, initialValues, formSchema, uiSchema),
    );
  };

  useEffect(() => onMount(), []);

  function validatePhone(value) {
    if (value?.length === 0) {
      return 'Please provide a response';
    }

    const stripped = value.replace(/[^\d]/g, '');
    if (!/^\d{10}$/.test(stripped)) {
      return 'Please enter a 10-digit phone number (with or without dashes)';
    }

    return '';
  }

  const handleSubmit = () => {
    startTransaction(formField.value);
  };

  const validate = values => {
    const errors = {};
    const phoneError = validatePhone(values?.inputPhoneNumber);
    if (phoneError) errors.inputPhoneNumber = phoneError;
    return errors;
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validate={validate}
    >
      <Form ref={formRef}>
        <div className="vads-u-margin-bottom--2">{children}</div>

        {error && (
          <div
            role="alert"
            className="vads-u-margin-y--2"
            data-testid="edit-error-alert"
          >
            <VAPServiceEditModalErrorMessage error={error} />
          </div>
        )}

        <ProfileInformationActionButtons
          onCancel={onCancel}
          title={title}
          analyticsSectionName={analyticsSectionName}
        >
          <div>
            <LoadingButton
              data-action="save-edit"
              data-testid="save-edit-button"
              isLoading={isLoading}
              loadingText="Saving changes"
              className="vads-u-margin-top--0"
            >
              Update
            </LoadingButton>

            {!isLoading && (
              <button
                data-testid="cancel-edit-button"
                type="button"
                className="usa-button-secondary small-screen:vads-u-margin-top--0"
                onClick={onCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </ProfileInformationActionButtons>
      </Form>
    </Formik>
  );
};

ProfileFormContainerVAFSC.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  fieldName: PropTypes.oneOf(Object.values(VAP_SERVICE.FIELD_NAMES)).isRequired,
  getInitialFormValues: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  formRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
};

export default ProfileFormContainerVAFSC;

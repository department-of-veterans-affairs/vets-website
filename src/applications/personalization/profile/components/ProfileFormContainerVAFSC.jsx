import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';

import { updateFormFieldWithSchema } from '@@vap-svc/actions';
import * as VAP_SERVICE from '@@vap-svc/constants';
import VAPServiceEditModalErrorMessage from '@@vap-svc/components/base/VAPServiceEditModalErrorMessage';
import { selectVAPServiceTransaction } from '@@vap-svc/selectors';
import {
  isFailedTransaction,
  isPendingTransaction,
} from '@@vap-svc/util/transactions';

import LoadingButton from '~/platform/site-wide/loading-button/LoadingButton';

import ProfileInformationActionButtons from './ProfileInformationActionButtons';

const ProfileFormContainerVAFSC = ({
  fieldName,
  formSchema,
  getInitialFormValues,
  onCancel,
  title,
  uiSchema,
  children,
}) => {
  const dispatch = useDispatch();

  const analyticsSectionName = VAP_SERVICE.ANALYTICS_FIELD_MAP[fieldName];

  const initialValues = getInitialFormValues() || { [fieldName]: '' };

  useEffect(() => {
    dispatch(
      updateFormFieldWithSchema(fieldName, initialValues, formSchema, uiSchema),
    );
  }, []);

  // const formik = useFormik({
  //   initialValues,
  //   onSubmit: values => {
  //     const payload = convertCleanDataToPayload(values, fieldName);
  //     dispatch(
  //       createPersonalInfoUpdate({
  //         route: apiRoute,
  //         method: 'PUT',
  //         fieldName,
  //         payload,
  //         analyticsSectionName,
  //         value: values,
  //       }),
  //     );
  //   },
  // });

  const { transaction, transactionRequest } = useSelector(state =>
    selectVAPServiceTransaction(state, fieldName),
  );

  const isLoading =
    transactionRequest?.isPending || isPendingTransaction(transaction);
  const error =
    transactionRequest?.error || (isFailedTransaction(transaction) ? {} : null);

  // const handleFieldInput = e => {
  //   const value = { [fieldName]: e?.target?.value };
  //   dispatch(updateFormFieldWithSchema(fieldName, value, formSchema, uiSchema));
  // };

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
    // console.log('handleSubmit', values);
  };

  const validate = values => {
    const errors = {};
    const phoneError = validatePhone(values.inputPhoneNumber);
    if (phoneError) errors.inputPhoneNumber = phoneError;
    return errors;
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validate={validate}
    >
      <Form>
        {children}

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
  apiRoute: PropTypes.oneOf(Object.values(VAP_SERVICE.API_ROUTES)).isRequired,
  convertCleanDataToPayload: PropTypes.func.isRequired,
  fieldName: PropTypes.oneOf(Object.values(VAP_SERVICE.FIELD_NAMES)).isRequired,
  formSchema: PropTypes.object.isRequired,
  getInitialFormValues: PropTypes.func.isRequired,
  uiSchema: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  title: PropTypes.string,
};

export default ProfileFormContainerVAFSC;

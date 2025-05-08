import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { setData } from '@department-of-veterans-affairs/platform-forms-system/actions';
import set from '@department-of-veterans-affairs/platform-utilities/data/set';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export const FormSignature = ({
  signature,
  setSignature,
  signatureError,
  setSignatureError,
  signatureLabel,
  formData,
  signaturePath,
  required,
  showError,
  validations,
  requiredErrorMessage,
}) => {
  const dispatch = useDispatch();

  useEffect(
    () => {
      // Required validation always comes first
      if (required)
        validations.unshift(
          signatureValue =>
            !signatureValue ? requiredErrorMessage : undefined,
        );

      // First validation error in the array gets displayed
      setSignatureError(
        validations.reduce(
          (errorMessage, validator) =>
            errorMessage || validator(signature.value, formData),
          null,
        ),
      );
    },
    [
      required,
      signature,
      formData,
      validations,
      requiredErrorMessage,
      setSignatureError,
    ],
  );

  useEffect(
    () => {
      dispatch(setData(set(signaturePath, signature.value, formData)));
    },
    [signature, signaturePath],
  );

  return (
    <>
      <VaTextInput
        label={signatureLabel}
        value={signature.value}
        onInput={event => {
          setSignature({ value: event.target.value });
        }}
        onBlur={() => {
          setSignature({ value: signature.value, dirty: true });
        }}
        required={required}
        error={((showError || signature.dirty) && signatureError) || null}
      />
    </>
  );
};

FormSignature.propTypes = {
  setSignature: PropTypes.func.isRequired,
  setSignatureError: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  showError: PropTypes.bool.isRequired,
  required: PropTypes.bool,
  signatureLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  signaturePath: PropTypes.string,
  validations: PropTypes.arrayOf(PropTypes.func),
  requiredErrorMessage: PropTypes.string,
  signature: PropTypes.object,
  signatureError: PropTypes.string,
};

FormSignature.defaultProps = {
  signatureLabel: 'Veteran’s full name',
  signaturePath: 'signature',
  requiredErrorMessage: 'Please enter your name',
  required: true,
  validations: [],
};

export default FormSignature;

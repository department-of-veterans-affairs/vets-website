import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import set from 'platform/utilities/data/set';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export const FormSignature = ({
  signature,
  setSignature,
  signatureError,
  setSignatureError,
  signatureLabel,
  formData,
  setFormData,
  signaturePath,
  required,
  showError,
  validations,
  requiredErrorMessage,
}) => {
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
    [required, signature, formData, validations],
  );

  // Update signature in formData
  useEffect(
    () => {
      setFormData(set(signaturePath, signature.value, formData));
    },
    // Don't re-execute when formData changes because this changes formData
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  signature: PropTypes.object,
  setSignature: PropTypes.func.isRequired,
  signatureError: PropTypes.string,
  setSignatureError: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  // eslint-disable-next-line react/sort-prop-types
  setFormData: PropTypes.func.isRequired,
  showError: PropTypes.bool.isRequired,
  required: PropTypes.bool,
  /**
   * The label for the signature input
   */
  signatureLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  /**
   * The path in the formData to the signature value
   */
  signaturePath: PropTypes.string,
  /**
   * An array of validator functions. Each function returns a string for the
   * validation message if the input is invalid, or undefined if the input is
   * valid.
   *
   * Subsequent validation functions do not run if previous validators
   * return an error message.
   *
   * Validator function have the following signature:
   *   function validator(signatureValue: string, formData: Object): string | undefined
   */
  validations: PropTypes.arrayOf(PropTypes.func),
  requiredErrorMessage: PropTypes.string,
};

FormSignature.defaultProps = {
  signatureLabel: 'Veteran’s full name',
  signaturePath: 'signature',
  requiredErrorMessage: 'Please enter your name',
  required: true,
  validations: [],
  // eslint-disable-next-line react/default-props-match-prop-types
  setFormData: () => {},
};

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  null,
  mapDispatchToProps,
)(FormSignature);

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import set from 'platform/utilities/data/set';
import {
  VaTextInput,
  VaCheckbox,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

/**
 * The text input and checkbox which make up the form signature. It's
 * recommended to use the Attestation component instead of FormSignature
 * directly, as that one also includes the gray box and handles the
 * aria-labelledby appropriately.
 *
 * Example usage in formConfig:
 * preSubmitInfo: {
 *   CustomComponent: (signatureProps) => (
 *     <section className="box vads-u-background-color--gray-lightest vads-u-padding-bottom--6 vads-u-padding-x--3 vads-u-padding-top--1px vads-u-margin-bottom--7">
 *       <h3>Statement of truth</h3>
 *       <p>I solemnly swear I am up to no good.</p>
 *       <FormSignature
 *         {...signatureProps}
 *         signatureLabel="Secret code name"
 *       />
 *     <section/>
 *   ),
 * }
 */
export const FormSignature = ({
  signatureLabel,
  checkboxLabel,
  checkboxDescription,
  formData,
  setFormData,
  signaturePath,
  required,
  showError,
  validations,
  onSectionComplete,
}) => {
  // Input states
  const [signature, setSignature] = useState({
    value: formData?.signature ?? '', // Pre-populate with existing signature if available
    dirty: formData?.signature?.length > 0, // will be dirty if any prev signature is present
  });
  const [checked, setChecked] = useState(formData?.AGREED ?? false);

  // Validation states
  const [signatureError, setSignatureError] = useState(null);
  const [checkboxError, setCheckboxError] = useState(null);

  // Section complete state (so callback isn't called too many times)
  const [sectionComplete, setSectionComplete] = useState(false);

  // Signature input validation
  useEffect(
    () => {
      // Required validation always comes first
      if (required)
        validations.unshift(
          signatureValue =>
            !signatureValue ? 'Please enter your name' : undefined,
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

  // Checkbox validation
  useEffect(
    () => {
      setCheckboxError(
        required && !checked
          ? 'Please check the box to certify the information is correct'
          : null,
      );
    },
    [required, checked],
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

  // Call onCompleteSection with true or false when switching between valid
  // and invalid states respectively
  useEffect(
    () => {
      const isComplete = checked && !signatureError;
      if (sectionComplete !== isComplete) {
        setSectionComplete(isComplete);
        onSectionComplete(isComplete);
      }
    },
    [checked, signatureError, sectionComplete, onSectionComplete],
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
      <VaCheckbox
        label={checkboxLabel}
        description={null}
        required={required}
        error={showError ? checkboxError : null}
        checked={checked}
        onVaChange={event => setChecked(event.target.checked)}
      >
        {checkboxDescription && <p slot="description">{checkboxDescription}</p>}
      </VaCheckbox>
    </>
  );
};

FormSignature.propTypes = {
  formData: PropTypes.object.isRequired,
  // eslint-disable-next-line react/sort-prop-types
  onSectionComplete: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
  showError: PropTypes.bool.isRequired,
  /**
   * The description for the checkbox input
   */
  checkboxDescription: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  /**
   * The label for the checkbox input
   */
  checkboxLabel: PropTypes.string,
  required: PropTypes.bool,
  /**
   * The label for the signature input
   */
  signatureLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  /**
   * The path in the formData to the signature value
   */
  signaturePath: PropTypes.string,
  submission: PropTypes.shape({
    hasAttemptedSubmit: PropTypes.bool,
    errorMessage: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    status: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  }),
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
};

FormSignature.defaultProps = {
  signatureLabel: 'Veteran’s full name',
  signaturePath: 'signature',
  checkboxLabel:
    'I certify the information above is correct and true to the best of my knowledge and belief.',
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

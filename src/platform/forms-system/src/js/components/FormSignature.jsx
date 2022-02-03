import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import TextInput from '@department-of-veterans-affairs/component-library/TextInput';
import Checkbox from '@department-of-veterans-affairs/component-library/Checkbox';

/**
 * Description of how the component behaves here.
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
 *   );
 * }
 */
export const FormSignature = ({
  signatureLabel,
  checkboxLabel,
  formData,
  required,
  showError,
  validations,
  onSectionComplete,
}) =>
  // {
  //   formData,
  //   onSectionComplete,
  //   setFormData,
  //   showError,
  //   submission,
  // },
  {
    // Input states
    const [signature, setSignature] = useState({ value: '', dirty: false });
    const [checked, setChecked] = useState(false);

    // Validation states
    const [signatureError, setSignatureError] = useState(null);
    const [checkboxError, setCheckboxError] = useState(null);

    // Section complete state (so callback isn't called too many times)
    const [sectionComplete, setSectionComplete] = useState(false);

    // Call onCompleteSection with true or false when switching between valid
    // and invalid states respectively
    const maybeCompleteSection = useCallback(
      () => {
        const isComplete = checked && !signatureError;
        if (sectionComplete !== isComplete) {
          // TODO: Figure out why this is firing twice in a row
          setSectionComplete(isComplete);
          onSectionComplete(isComplete);
        }
      },
      [checked, signatureError, sectionComplete, onSectionComplete],
    );

    // Signature input validation
    useEffect(
      () => {
        // Required validation always comes first
        if (required)
          validations.unshift(
            signatureValue =>
              !signatureValue ? 'Please sign your name' : undefined,
          );

        // First validation error in the array gets displayed
        setSignatureError(
          validations.reduce(
            (errorMessage, validator) =>
              errorMessage || validator(signature.value, formData),
            null,
          ),
        );

        maybeCompleteSection();
      },
      [required, signature, formData, validations, maybeCompleteSection],
    );

    // Checkbox validation
    useEffect(
      () => {
        setCheckboxError(
          required && !checked ? 'Must certify by checking box' : null,
        );
        maybeCompleteSection();
      },
      [required, checked, maybeCompleteSection],
    );

    return (
      <>
        <TextInput
          label={signatureLabel}
          field={signature}
          onValueChange={setSignature}
          required={required}
          errorMessage={(showError || signature.dirty) && signatureError}
        />
        <Checkbox
          label={checkboxLabel}
          required={required}
          onValueChange={setChecked}
          errorMessage={showError && checkboxError}
        />
      </>
    );
  };

FormSignature.propTypes = {
  formData: PropTypes.object.isRequired,
  onSectionComplete: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
  showError: PropTypes.bool.isRequired,
  submission: PropTypes.shape({
    hasAttemptedSubmit: PropTypes.bool,
    errorMessage: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    status: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  }),
  /**
   * The label for the signature input
   */
  signatureLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

  /**
   * The path in the formData to the signature value
   */
  signaturePath: PropTypes.string,

  /**
   * The label for the checkbox input
   */
  checkboxLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

  /**
   * An array of validator functions. Each function returns a string for the
   * validation message if the input is invalid, or undefined if the input is
   * valid.
   *
   * Validator function have the following signature:
   *   function validator(signatureValue: string, formData: Object): string | undefined
   */
  validations: PropTypes.arrayOf(PropTypes.func),
};

FormSignature.defaultProps = {
  signatureLabel: 'Veteran’s full name',
  checkboxLabel:
    'I certify the information above is correct and true to the best of my knowledge and belief.',
  required: true,
  validations: [],
  setFormData: () => {},
};

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  null,
  mapDispatchToProps,
)(FormSignature);

import React, { useState, useEffect } from 'react';
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
  required,
  showError,
}) =>
  // {
  //   formData,
  //   onSectionComplete,
  //   setFormData,
  //   showError,
  //   submission,
  // },
  {
    // TODO Add the checkbox
    const [signature, setSignature] = useState({ value: '', dirty: false });
    const [checked, setChecked] = useState(false);
    const [signatureError, setSignatureError] = useState(null);
    const [checkboxError, setCheckboxError] = useState(null);

    // Signature input validation
    useEffect(
      () => {
        let signatureErrorMessage = null;
        if (required && !signature.value)
          signatureErrorMessage =
            'Your signature must match your first and last name as previously entered';

        setSignatureError(signatureErrorMessage);
      },
      [required, signature],
    );

    // Checkbox validation
    useEffect(
      () =>
        setCheckboxError(
          required && !checked ? 'Must certify by checking box' : null,
        ),
      [required, checked],
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
  signatureLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

FormSignature.defaultProps = {
  signatureLabel: 'Veteran’s full name',
  checkboxLabel:
    'I certify the information above is correct and true to the best of my knowledge and belief.',
  required: true,
};

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  null,
  mapDispatchToProps,
)(FormSignature);

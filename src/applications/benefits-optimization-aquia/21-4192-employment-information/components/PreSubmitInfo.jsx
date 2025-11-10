import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { VaStatementOfTruth } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { setPreSubmit as setPreSubmitAction } from 'platform/forms-system/src/js/actions';

/**
 * Custom validation for statement of truth signature
 * Accepts any string longer than 2 characters
 *
 * @param {string} signatureValue - The signature input value
 * @returns {boolean} - True if valid, false otherwise
 */
const isSignatureValid = signatureValue => {
  return signatureValue && signatureValue.trim().length > 2;
};

const PreSubmitInfo = ({
  formData,
  showError,
  setPreSubmit,
  onSectionComplete,
}) => {
  const [
    statementOfTruthSignatureBlurred,
    setStatementOfTruthSignatureBlurred,
  ] = useState(false);

  // Validate that both signature is valid and checkbox is checked
  useEffect(
    () => {
      const isValid =
        isSignatureValid(formData.statementOfTruthSignature) &&
        formData.statementOfTruthCertified;
      onSectionComplete?.(isValid);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formData.statementOfTruthSignature, formData.statementOfTruthCertified],
  );

  const statementText =
    'I confirm that the identifying information in this form is accurate and has been represented correctly.';

  return (
    <VaStatementOfTruth
      heading="Statement of truth"
      inputLabel="Your full name"
      inputValue={formData.statementOfTruthSignature}
      inputMessageAriaDescribedby={`Statement of truth: ${statementText}`}
      inputError={
        (showError || statementOfTruthSignatureBlurred) &&
        !isSignatureValid(formData.statementOfTruthSignature)
          ? 'Please enter a name (at least 3 characters)'
          : undefined
      }
      checked={formData.statementOfTruthCertified}
      onVaInputChange={event =>
        setPreSubmit('statementOfTruthSignature', event.detail.value)
      }
      onVaInputBlur={() => setStatementOfTruthSignatureBlurred(true)}
      onVaCheckboxChange={event =>
        setPreSubmit('statementOfTruthCertified', event.detail.checked)
      }
      checkboxError={
        showError && !formData.statementOfTruthCertified
          ? 'You must certify by checking the box'
          : undefined
      }
    >
      <p>{statementText}</p>
    </VaStatementOfTruth>
  );
};

PreSubmitInfo.propTypes = {
  formData: PropTypes.object.isRequired,
  setPreSubmit: PropTypes.func.isRequired,
  showError: PropTypes.bool,
  onSectionComplete: PropTypes.func,
};

const mapDispatchToProps = {
  setPreSubmit: setPreSubmitAction,
};

export default connect(
  null,
  mapDispatchToProps,
)(PreSubmitInfo);

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { VaStatementOfTruth } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import {
  fullNameReducer,
  statementOfTruthBodyElement,
  statementOfTruthFullName,
} from 'platform/forms/components/review/PreSubmitSection';
import { setPreSubmit as setPreSubmitAction } from 'platform/forms-system/src/js/actions';

const SIGNATURE_MISMATCH_MESSAGE =
  'Enter your name exactly as it appears on your form';

export function PreSubmitInfo({
  formData,
  preSubmitInfo,
  showError,
  user,
  setPreSubmit,
}) {
  const { statementOfTruth } = preSubmitInfo;
  const [
    statementOfTruthSignatureBlurred,
    setStatementOfTruthSignatureBlurred,
  ] = useState(false);

  const expectedFullName = statementOfTruthFullName(
    formData,
    statementOfTruth,
    user?.profile?.userFullName,
  );

  const signatureMismatch =
    fullNameReducer(formData?.statementOfTruthSignature) !==
    fullNameReducer(expectedFullName);

  const showSignatureError =
    (showError || statementOfTruthSignatureBlurred) && signatureMismatch;

  return (
    <VaStatementOfTruth
      heading={statementOfTruth.heading}
      inputLabel={statementOfTruth.textInputLabel || 'Your full name'}
      inputValue={formData?.statementOfTruthSignature}
      inputMessageAriaDescribedby={`${statementOfTruth.heading}: ${
        statementOfTruth.messageAriaDescribedby
      }`}
      inputError={
        showSignatureError
          ? `${SIGNATURE_MISMATCH_MESSAGE}: ${expectedFullName}`
          : undefined
      }
      checked={formData?.statementOfTruthCertified}
      onVaInputChange={event =>
        setPreSubmit('statementOfTruthSignature', event.detail.value)
      }
      onVaInputBlur={() => setStatementOfTruthSignatureBlurred(true)}
      onVaCheckboxChange={event =>
        setPreSubmit('statementOfTruthCertified', event.detail.checked)
      }
      checkboxError={
        showError && !formData?.statementOfTruthCertified
          ? 'You must certify by checking the box'
          : undefined
      }
    >
      {statementOfTruthBodyElement(formData, statementOfTruth.body)}
    </VaStatementOfTruth>
  );
}

PreSubmitInfo.propTypes = {
  formData: PropTypes.object.isRequired,
  preSubmitInfo: PropTypes.shape({
    statementOfTruth: PropTypes.shape({
      heading: PropTypes.string,
      textInputLabel: PropTypes.string,
      messageAriaDescribedby: PropTypes.string,
      body: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
      fullNamePath: PropTypes.string,
    }).isRequired,
  }).isRequired,
  setPreSubmit: PropTypes.func.isRequired,
  showError: PropTypes.bool,
  user: PropTypes.shape({
    profile: PropTypes.shape({
      userFullName: PropTypes.string,
    }),
  }),
};

const mapDispatchToProps = {
  setPreSubmit: setPreSubmitAction,
};

export default connect(
  null,
  mapDispatchToProps,
)(PreSubmitInfo);

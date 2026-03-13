import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { VaStatementOfTruth } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { setPreSubmit as setPreSubmitAction } from 'platform/forms-system/src/js/actions';
import {
  fullNameReducer,
  statementOfTruthBodyElement,
  statementOfTruthFullName,
} from 'platform/forms/components/review/PreSubmitSection';

const PreSubmitInfo = ({
  formData,
  preSubmitInfo,
  showError,
  setPreSubmit,
  user,
}) => {
  const { statementOfTruth } = preSubmitInfo;
  const [signatureBlurred, setSignatureBlurred] = useState(false);

  const expectedFullName = statementOfTruthFullName(
    formData,
    statementOfTruth,
    user?.profile?.userFullName,
  );

  return (
    <>
      <h2 className="vads-u-margin-top--0 vads-u-visibility--screen-reader">
        Statement of Truth Section
      </h2>
      <VaStatementOfTruth
        heading={statementOfTruth.heading || 'Statement of truth'}
        inputLabel={statementOfTruth.textInputLabel || 'Your full name'}
        inputValue={formData.statementOfTruthSignature}
        inputMessageAriaDescribedby={`${statementOfTruth.heading ||
          'Statement of truth'}: ${statementOfTruth.messageAriaDescribedby}`}
        inputError={
          (showError || signatureBlurred) &&
          fullNameReducer(formData.statementOfTruthSignature) !==
            fullNameReducer(expectedFullName)
            ? `Please enter your name exactly as it appears on your application: ${expectedFullName}`
            : undefined
        }
        checked={formData.statementOfTruthCertified}
        onVaInputChange={event =>
          setPreSubmit('statementOfTruthSignature', event.detail.value)
        }
        onVaInputBlur={() => setSignatureBlurred(true)}
        onVaCheckboxChange={event =>
          setPreSubmit('statementOfTruthCertified', event.detail.checked)
        }
        checkboxError={
          showError && !formData.statementOfTruthCertified
            ? 'You must certify by checking the box'
            : undefined
        }
      >
        {statementOfTruthBodyElement(formData, statementOfTruth.body)}
      </VaStatementOfTruth>
    </>
  );
};

PreSubmitInfo.propTypes = {
  formData: PropTypes.shape({
    statementOfTruthCertified: PropTypes.bool,
    statementOfTruthSignature: PropTypes.string,
  }).isRequired,
  preSubmitInfo: PropTypes.shape({
    statementOfTruth: PropTypes.shape({
      body: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
      heading: PropTypes.string,
      messageAriaDescribedby: PropTypes.string,
      textInputLabel: PropTypes.string,
    }).isRequired,
  }).isRequired,
  setPreSubmit: PropTypes.func.isRequired,
  showError: PropTypes.bool,
  user: PropTypes.shape({
    profile: PropTypes.shape({
      userFullName: PropTypes.object,
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

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import {
  VaPrivacyAgreement,
  VaStatementOfTruth,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { isLoggedIn } from 'platform/user/selectors';
import {
  fullNameReducer,
  statementOfTruthFullName,
  statementOfTruthBodyElement,
} from '~/platform/forms/components/review/PreSubmitSection';

import { setPreSubmit as setPreSubmitAction } from 'platform/forms-system/src/js/actions';

const PreSubmitInfo = ({
  formData,
  preSubmitInfo,
  showError,
  setPreSubmit,
  user,
}) => {
  const { statementOfTruth } = preSubmitInfo;
  const statementOfTruthCertified = formData.statementOfTruthCertified || false;
  const { claimantType } = formData;
  const loggedIn = useSelector(isLoggedIn);
  const [
    statementOfTruthSignatureBlurred,
    setStatementOfTruthSignatureBlurred,
  ] = useState(false);

  const useProfileFullName = loggedIn && claimantType === 'VETERAN';

  const expectedFullName = statementOfTruthFullName(
    formData,
    {
      ...statementOfTruth,
      useProfileFullName,
    },
    user?.profile?.userFullName,
  );

  return (
    <>
      {useProfileFullName ? (
        <>
          <div className="vads-u-margin-y--2p5">
            <strong>Note:</strong> According to federal law, there are criminal
            penalties, including a fine and/or imprisonment for up to 5 years,
            for withholding information or for providing incorrect information.
            (See 18 U.S.C. 1001)
          </div>
          <VaPrivacyAgreement
            checked={formData.statementOfTruthCertified}
            name="statementOfTruthCertified"
            onVaChange={event => {
              setPreSubmit('statementOfTruthCertified', event.detail.checked);
              setPreSubmit('statementOfTruthSignature', expectedFullName);
            }}
            showError={showError && !statementOfTruthCertified}
          />
        </>
      ) : (
        <VaStatementOfTruth
          heading={statementOfTruth.heading || 'Statement of truth'}
          inputLabel={statementOfTruth.textInputLabel || 'Your full name'}
          inputValue={formData.statementOfTruthSignature}
          inputMessageAriaDescribedby={`${statementOfTruth.heading ||
            'Statement of truth'}: ${statementOfTruth.messageAriaDescribedby}`}
          inputError={
            (showError || statementOfTruthSignatureBlurred) &&
            fullNameReducer(formData.statementOfTruthSignature) !==
              fullNameReducer(expectedFullName)
              ? `Please enter your name exactly as it appears on your application: ${expectedFullName}`
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
          {statementOfTruthBodyElement(formData, statementOfTruth.body)}
        </VaStatementOfTruth>
      )}
    </>
  );
};

PreSubmitInfo.propTypes = {
  formData: PropTypes.object.isRequired,
  setPreSubmit: PropTypes.func.isRequired,
  preSubmitInfo: PropTypes.shape({
    statementOfTruth: PropTypes.shape({
      heading: PropTypes.string,
      textInputLabel: PropTypes.string,
      messageAriaDescribedby: PropTypes.string,
      body: PropTypes.string,
    }),
  }),
  showError: PropTypes.bool,
  user: PropTypes.shape({
    login: PropTypes.shape({
      currentlyLoggedIn: PropTypes.bool,
    }),
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

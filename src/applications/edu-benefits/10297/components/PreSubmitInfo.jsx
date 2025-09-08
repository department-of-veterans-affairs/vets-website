import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import {
  VaPrivacyAgreement,
  VaStatementOfTruth,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { isLoggedIn } from 'platform/user/selectors';
import { querySelectorWithShadowRoot } from 'platform/utilities/ui/webComponents';

import {
  fullNameReducer,
  statementOfTruthFullName,
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
  const { claimantType } = formData;
  const privacyAgreementAccepted = formData.privacyAgreementAccepted || false;
  const loggedIn = useSelector(isLoggedIn);
  const [
    statementOfTruthSignatureBlurred,
    setStatementOfTruthSignatureBlurred,
  ] = useState(false);
  const hasModifiedError = useRef(false);

  const useProfileFullName = loggedIn && claimantType === 'VETERAN';

  const expectedFullName = statementOfTruthFullName(
    formData,
    {
      ...statementOfTruth,
      useProfileFullName,
    },
    user?.profile?.userFullName,
  );
  useEffect(() => {
    const verteranClarifyingText = async () => {
      const clarifyingText = await querySelectorWithShadowRoot(
        'p:has(va-link)',
        document.querySelector('va-statement-of-truth'),
      );
      const statementText = await querySelectorWithShadowRoot(
        'va-checkbox > span',
        document.querySelector('va-privacy-agreement'),
      );
      if (statementText) {
        statementText.setAttribute('style', 'display: none;');
      }
      if (clarifyingText) {
        clarifyingText.setAttribute('style', 'display: none;');
      }
      const privacyPolicyText = await querySelectorWithShadowRoot(
        'va-checkbox',
        document.querySelector('va-privacy-agreement'),
      );
      if (privacyPolicyText) {
        privacyPolicyText.innerHTML = 'please check';
      }
      const clarifyingTextLabel = await querySelectorWithShadowRoot(
        'span[part="label"]',
        clarifyingText,
      );
      const clarifyingTextLabel2 = await querySelectorWithShadowRoot(
        'span[part="label"]',
        privacyPolicyText,
      );
      if (clarifyingTextLabel2) {
        clarifyingTextLabel2.innerHTML =
          'Yes, I have read and acknowledge these statements.';
      }
      if (clarifyingTextLabel) {
        clarifyingTextLabel.innerHTML =
          'I certify that the information I have provided is true and correct to the best of my knowledge and belief.';
      }
    };

    const removeElements = async () => {
      // Hide platform line for privacy policy, use custom
      // await removeOldPrivacyPolicy();
      await verteranClarifyingText();
    };

    removeElements();
  }, []);
  useEffect(() => {
    if (hasModifiedError.current) return;

    (async () => {
      const privacyPolicyText = await querySelectorWithShadowRoot(
        'va-checkbox',
        document.querySelector('va-privacy-agreement'),
      );
      const errorMessage = await querySelectorWithShadowRoot(
        '[class="usa-error-message"]',
        privacyPolicyText,
      );
      if (
        errorMessage &&
        errorMessage.innerHTML !==
          'You must read and acknowledge these statements'
      ) {
        errorMessage.innerHTML =
          'You must read and acknowledge these statements';
        hasModifiedError.current = true;
      }
    })();
  });
  return (
    <>
      <div className="statement-wrapper">
        <h3>Attestation</h3>
        <p className="vads-u-margin-top--3">
          Please check the box below if you agree to the following statements:
        </p>
        <ul className="numbered-list">
          <li>
            I understand that if I still have benefits left under chapters 30,
            33, or 35, one month of my benefits will be used for each month of
            education I receive through this program. If I qualify for more than
            one benefit, VA will use the one that pays me the most. For example,
            if I qualify for both chapter 30 and chapter 33, VA will use chapter
            30 because it usually pays more. If I want VA to use a different
            benefit, I must contact them to switch to the program of my choice.
          </li>
          <li>
            I understand that if I’m enrolled in a high-tech program under this
            section and don’t have any benefits left under chapters 30, 33, or
            35, VA will still give me this education benefit in addition to what
            I’ve already used before.
          </li>
        </ul>
        <VaPrivacyAgreement
          className="privacy-agreement"
          name="privacyAgreementAccepted"
          checked={privacyAgreementAccepted}
          onVaChange={event => {
            hasModifiedError.current = false;
            setPreSubmit('privacyAgreementAccepted', event.detail.checked);
          }}
          showError={
            showError && !privacyAgreementAccepted
              ? preSubmitInfo.error
              : undefined
          }
          uswds
        />
      </div>
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
        hideLegalNote
        checkboxError={
          showError && !formData.statementOfTruthCertified
            ? 'You must certify by checking the box'
            : undefined
        }
      >
        <div>
          <p>
            The information you provide in this application will help us
            determine if you’re eligible for the VET TEC 2.0 Program. We may
            audit this information to make sure it’s accurate.
          </p>
          <p>
            I certify that the statements made on this form to the best of my
            knowledge are true and correct. I understand that by submitting this
            form, I am making a statement to the government for the purposes of
            obtaining federal benefits. Section 1001 of Title 18 of the U.S.
            Code makes it a criminal offense for any person to knowingly and
            willfully make false or fraudulent statements to any department or
            agency of the United States Government. Additionally, I understand
            that if the information I have provided on this form is found to be
            false or incorrect, I will immediately be unable to receive benefits
            under this program, and I may be required to reimburse the federal
            government for any benefits I have already received.
          </p>
        </div>
      </VaStatementOfTruth>
    </>
  );
};

PreSubmitInfo.propTypes = {
  formData: PropTypes.object.isRequired,
  setPreSubmit: PropTypes.func.isRequired,
  preSubmitInfo: PropTypes.shape({
    error: PropTypes.string,
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

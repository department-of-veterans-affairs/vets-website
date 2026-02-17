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
  const privacyAgreementAccepted = formData.privacyAgreementAccepted || false;
  const loggedIn = useSelector(isLoggedIn);
  const [
    statementOfTruthSignatureBlurred,
    setStatementOfTruthSignatureBlurred,
  ] = useState(false);
  const hasModifiedError = useRef(false);

  // VET TEC is only for veterans, so always use profile name when logged in
  const useProfileFullName = loggedIn;

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
      const statementOfTruthText = await querySelectorWithShadowRoot(
        'va-checkbox',
        document.querySelector('va-statement-of-truth'),
      );
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
        statementOfTruthText,
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
          'Yes, I have read and acknowledge this statement.';
      }
      // const labelStyle = await querySelectorWithShadowRoot(
      //   'label[for="checkbox-element"]',
      //   statementOfTruthText,
      // );
      // if (labelStyle) {
      //   labelStyle.setAttribute('style', 'white-space: nowrap;');
      // }
      const labelStyle = await querySelectorWithShadowRoot(
        'label[for="checkbox-element"]',
        statementOfTruthText,
      );
      if (labelStyle && window.innerWidth >= 768) {
        labelStyle.setAttribute('style', 'white-space: nowrap;');
      }
      const labelStyle2 = await querySelectorWithShadowRoot(
        'label[for="checkbox-element"]',
        privacyPolicyText,
      );
      if (window.innerWidth <= 768 && labelStyle2) {
        labelStyle2.setAttribute('style', 'white-space: break-spaces;');
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
      if (window.innerWidth <= 768 && errorMessage) {
        errorMessage.setAttribute('style', 'white-space: break-spaces;');
      }
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
        <h3 className="vads-u-font-family--serif">Attestation</h3>
        <p className="vads-u-margin-top--3 vads-u-font-family--sans">
          Please check the box below if you agree to the following statements:
        </p>
        <ul className="numbered-list">
          <li className="vads-u-font-family--sans">
            I understand that if I have eligibility remaining under chapter 30,
            33, or 35 of this title, such entitlement shall be charged at the
            rate of one month of such entitlement for each month of educational
            assistance provided under this section. If I am eligible for more
            than one of these education benefits, VA will charge the program
            determined to be most advantageous to me. For example, if I am
            eligible for chapter 30 and chapter 33, VA will charge my benefits
            under chapter 33 since that pays less in most cases. If you want VA
            to charge your entitlement under a different benefit, you can write
            to tell us to switch to the program of your choice.
          </li>
          <li className="vads-u-font-family--sans">
            If I am enrolled in a high technology program of education under
            this section and do not have remaining entitlement to educational
            assistance under chapter 30, 33, or 35 of this title, any
            educational assistance provided to me under this section shall be
            provided in addition to the entitlement I used previously.
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
        heading="Certification statement"
        inputLabel={statementOfTruth.textInputLabel || 'Your full name'}
        inputValue={formData.statementOfTruthSignature}
        inputMessageAriaDescribedby={`${statementOfTruth.heading ||
          'Certification statement'}: ${
          statementOfTruth.messageAriaDescribedby
        }`}
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

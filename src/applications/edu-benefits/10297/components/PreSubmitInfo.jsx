import React, { useState, useEffect } from 'react';

import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { querySelectorWithShadowRoot } from 'platform/utilities/ui/webComponents';

import PrivacyActStatement from './PrivacyActStatement';

function PreSubmitInfo() {
  const [showModal, setShowModal] = useState(false);

  const verteranClarifyingText = async () => {
    const clarifyingText = await querySelectorWithShadowRoot(
      'va-checkbox',
      document.querySelector('va-statement-of-truth'),
    );
    const vaStatement = document.querySelector('va-statement-of-truth');
    vaStatement?.setAttribute('hide-legal-note', 'true');
    // console.log('vaStatement', vaStatement);
    // console.log('clarifyingText', clarifyingText);
    // clarifyingText?.setAttribute('style', 'display:none;');
    const clarifyingTextLabel = await querySelectorWithShadowRoot(
      'span[part="label"]',
      clarifyingText,
    );
    if (clarifyingTextLabel) {
      clarifyingTextLabel.innerHTML =
        'I certify that the information I have provided is true and correct to the best of my knowledge and belief.';
    }
  };
  const removeOldPrivacyPolicy = async () => {
    const privacyPolicyText = await querySelectorWithShadowRoot(
      'p.short-line',
      document.querySelector('va-statement-of-truth'),
    );
    privacyPolicyText?.setAttribute('style', 'display:none;');
  };

  useEffect(() => {
    const removeElements = async () => {
      // Hide platform line for privacy policy, use custom
      await removeOldPrivacyPolicy();
      await verteranClarifyingText();
    };

    removeElements();
  }, []);

  const privacyPolicyContent = (
    <span data-testid="privacy-policy-text">
      I have read and accept the{' '}
      <va-link
        onClick={() => setShowModal(true)}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            setShowModal(true);
          }
        }}
        text="privacy policy."
        aria-label="View the privacy policy"
        role="button"
        tabIndex="0"
      />
    </span>
  );

  const certificationContent = (
    <>
      <p>
        The information you provide in this application will help us determine
        if you’re eligible for the VET TEC 2.0 Program. We may audit this
        information to make sure it’s accurate.
      </p>
      <p>
        I certify that the statements made on this form to the best of my
        knowledge are true and correct. I understand that by submitting this
        form, I am making a statement to the government for the purposes of
        obtaining federal benefits. Section 1001 of Title 18 of the U.S. Code
        makes it a criminal offense for any person to knowingly and willfully
        make false or fraudulent statements to any department or agency of the
        United States Government. Additionally, I understand that if the
        information I have provided on this form is found to be false or
        incorrect, I will immediately be unable to receive benefits under this
        program, and I may be required to reimburse the federal government for
        any benefits I have already received.
      </p>

      {/* {privacyPolicyContent} */}
    </>
  );

  return (
    <>
      <div>{certificationContent}</div>
      {/* <VaModal
        modalTitle="Privacy Act Statement"
        onCloseEvent={() => setShowModal(!showModal)}
        visible={showModal}
        large
      >
        <PrivacyActStatement />
      </VaModal> */}
    </>
  );
}

export default PreSubmitInfo;

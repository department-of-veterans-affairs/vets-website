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
        if you’re eligible for the High Technology Program. We may audit this
        information to make sure it’s accurate.
      </p>
      <p>By checking the box below, you’re confirming that:</p>
      <ul>
        <li>
          You understand that if you have benefits left under chapter 30, 32,
          33, or 35, we’ll use the one that gives you the most support. If you’d
          rather use a different benefit, just contact us.
        </li>
        <li>
          If you don’t have any benefits left under those chapters, we’ll still
          provide support through this program. It won’t affect the benefits
          you’ve already used.
        </li>
        <li>
          Everything you’ve shared here is true and correct to the best of your
          knowledge.
        </li>
      </ul>
      {privacyPolicyContent}
    </>
  );

  return (
    <>
      <div>{certificationContent}</div>
      <VaModal
        modalTitle="Privacy Act Statement"
        onCloseEvent={() => setShowModal(!showModal)}
        visible={showModal}
        large
      >
        <PrivacyActStatement />
      </VaModal>
    </>
  );
}

export default PreSubmitInfo;

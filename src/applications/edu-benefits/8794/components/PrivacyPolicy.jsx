import React, { useEffect, useState } from 'react';

import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { querySelectorWithShadowRoot } from 'platform/utilities/ui/webComponents';

import PrivacyActStatement from './PrivacyActStatement';

export const patchStatementErrorText = () => {
  const sot = document.querySelector('va-statement-of-truth');
  if (!sot) return () => {};

  const observer = new MutationObserver(() => {
    const err = sot.getAttribute('input-error');
    if (err?.includes('application')) {
      sot.setAttribute('input-error', err.replace('application', 'form'));
    }
  });

  observer.observe(sot, {
    attributes: true,
    attributeFilter: ['input-error'],
  });
  return () => observer.disconnect();
};

const PrivacyPolicy = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const removeNoteText = async () => {
    const noteText = await querySelectorWithShadowRoot(
      'p.font-sans-6',
      document.querySelector('va-statement-of-truth'),
    );
    noteText?.setAttribute('style', 'display:none;');
  };
  const verteranClarifyingText = async () => {
    const clarifyingText = await querySelectorWithShadowRoot(
      'va-checkbox',
      document.querySelector('va-statement-of-truth'),
    );
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
    const cleanupErrorPatch = patchStatementErrorText();
    const removeElements = async () => {
      // Hide "Note" above Certification statement
      await removeNoteText();
      // Hide platform line for privacy policy, use custom
      await removeOldPrivacyPolicy();
      await verteranClarifyingText();
    };

    removeElements();
    return () => {
      cleanupErrorPatch();
    };
  }, []);

  return (
    <div>
      <span className="vads-u-display--block vads-u-margin-bottom--2">
        I confirm that the identifying information in this form is accurate and
        has been represented correctly.
      </span>
      <span data-testid="privacy-policy-text">
        I have read and accept the{' '}
        <va-link
          onKeyDown={e => {
            if (e.key === 'Enter') {
              setIsModalVisible(true);
            }
          }}
          onClick={() => setIsModalVisible(true)}
          text="privacy policy."
          tabIndex="0"
        />
      </span>
      <VaModal
        large
        modalTitle="Privacy Act Statement"
        onCloseEvent={() => setIsModalVisible(false)}
        visible={isModalVisible}
      >
        <PrivacyActStatement />
      </VaModal>
    </div>
  );
};

export default PrivacyPolicy;

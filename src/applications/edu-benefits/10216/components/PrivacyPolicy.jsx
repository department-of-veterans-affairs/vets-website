import React, { useState, useEffect } from 'react';
import { querySelectorWithShadowRoot } from 'platform/utilities/ui/webComponents';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import ResBurdenPrivacyPolicy from './ResBurdenPrivacyAct';

const PrivacyPolicy = () => {
  const [showModal, setShowModal] = useState(false);

  const removeOldPrivacyPolicy = async () => {
    const privacyPolicyText = await querySelectorWithShadowRoot(
      'p.short-line',
      document.querySelector('va-statement-of-truth'),
    );
    privacyPolicyText?.setAttribute('style', 'display:none;');
  };

  useEffect(() => {
    // Hide platform line for privacy policy, use custom
    removeOldPrivacyPolicy();
  }, []);

  return (
    <div>
      <span data-testid="privacy-policy-text">
        I have read and accept the{' '}
        <va-link
          onClick={() => setShowModal(true)}
          text="privacy policy"
          aria-label="View the privacy policy"
          role="button"
          tabIndex="0"
        />
      </span>
      <VaModal
        modalTitle="Privacy Act Statement"
        onCloseEvent={() => setShowModal(!showModal)}
        visible={showModal}
        large
      >
        <ResBurdenPrivacyPolicy />
      </VaModal>
    </div>
  );
};

export default PrivacyPolicy;

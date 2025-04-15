import React, { useEffect, useState } from 'react';

import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { querySelectorWithShadowRoot } from 'platform/utilities/ui/webComponents';

import PrivacyActStatement from './PrivacyActStatement';

const PrivacyPolicy = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const removeNoteText = async () => {
    const noteText = await querySelectorWithShadowRoot(
      'p.font-sans-6',
      document.querySelector('va-statement-of-truth'),
    );
    noteText?.setAttribute('style', 'display:none;');
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
      // Hide "Note" above Certification statement
      await removeNoteText();
      // Hide platform line for privacy policy, use custom
      await removeOldPrivacyPolicy();
    };

    removeElements();
  }, []);

  return (
    <div>
      <span>
        I have read and accept the{' '}
        <va-link
          onClick={() => setIsModalVisible(true)}
          text="privacy policy."
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

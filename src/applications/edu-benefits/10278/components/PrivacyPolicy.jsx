import React, { useEffect, useState } from 'react';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { querySelectorWithShadowRoot } from 'platform/utilities/ui/webComponents';

import PrivacyActStatement from './PrivacyActStatement';

const certifyCheckboxText =
  'I certify that the information above is correct and true to the best of my knowledge and belief.';

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

const setCertifyCheckboxText = async () => {
  const checkbox = await querySelectorWithShadowRoot(
    'va-checkbox',
    document.querySelector('va-statement-of-truth'),
  );
  const label = await querySelectorWithShadowRoot(
    'span[part="label"]',
    checkbox,
  );
  if (label) {
    label.innerHTML = certifyCheckboxText;
  }
};

const PrivacyPolicy = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const initializeComponent = async () => {
      await removeNoteText();
      await removeOldPrivacyPolicy();
      await setCertifyCheckboxText();
    };

    initializeComponent();
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
          onClick={() => setIsModalVisible(true)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              setIsModalVisible(true);
            }
          }}
          text="privacy policy"
          aria-label="View the privacy policy"
          role="button"
          tabIndex="0"
        />
        .
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

import React, { useState, useEffect } from 'react';
import { querySelectorWithShadowRoot } from 'platform/utilities/ui/webComponents';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import ResBurdenPrivacyPolicy from './ResBurdenPrivacyAct';

const PrivacyPolicy = () => {
  const [showModal, toggleShowModal] = useState(false);

  useEffect(() => {
    (async () => {
      const privacyPolicyText = await querySelectorWithShadowRoot(
        'p.short-line',
        document.querySelector('va-statement-of-truth'),
      );
      privacyPolicyText.setAttribute('style', 'display:none;');
    })();
  }, []);

  return (
    <div>
      <span>
        I have read and accept the{' '}
        <va-link onClick={() => toggleShowModal(true)} text="privacy policy" />
      </span>
      <VaModal
        modalTitle="Privacy Act Statement"
        onCloseEvent={() => toggleShowModal(!showModal)}
        visible={showModal}
      >
        <ResBurdenPrivacyPolicy />
      </VaModal>
    </div>
  );
};

export default PrivacyPolicy;

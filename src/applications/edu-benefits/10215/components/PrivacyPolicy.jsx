import React, { useEffect, useState } from 'react';

import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { querySelectorWithShadowRoot } from 'platform/utilities/ui/webComponents';

import PrivacyActStatement from './PrivacyActStatement';

const PrivacyPolicy = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const privacyPolicyText = await querySelectorWithShadowRoot(
        'p.short-line',
        document.querySelector('va-statement-of-truth'),
      );
      privacyPolicyText?.setAttribute('style', 'display:none;');
    })();
  }, []);

  return (
    <>
      <p>
        I have read and accept the{' '}
        <va-link
          onClick={() => setIsModalVisible(true)}
          text="privacy policy."
        />
        <VaModal
          large
          modalTitle="Privacy Act Statement"
          onCloseEvent={() => setIsModalVisible(false)}
          visible={isModalVisible}
        >
          <PrivacyActStatement />
        </VaModal>
      </p>
    </>
  );
};

export default PrivacyPolicy;

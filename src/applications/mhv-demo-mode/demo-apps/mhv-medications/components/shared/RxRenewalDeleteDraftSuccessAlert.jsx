import React, { useEffect, useRef, useState } from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';

const RxRenewalDeleteDraftSuccessAlert = () => {
  const [visible, setIsVisible] = useState(true);
  const alertRef = useRef(null);

  useEffect(() => {
    if (alertRef.current) {
      focusElement(alertRef.current);
    }
  }, []);

  return (
    <VaAlert
      ref={alertRef}
      slim
      closeable
      role="status"
      status="success"
      visible={visible}
      className="vads-u-margin-bottom--3"
      data-testid="rx-renewal-delete-draft-success-alert"
      onCloseEvent={() => {
        setIsVisible(false);
      }}
    >
      <p className="vads-u-margin-y--0">You successfully deleted your draft.</p>
    </VaAlert>
  );
};

export default RxRenewalDeleteDraftSuccessAlert;

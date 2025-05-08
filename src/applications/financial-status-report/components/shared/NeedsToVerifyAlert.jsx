import React, { useRef, useEffect } from 'react';

import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import VerifyAlert from '@department-of-veterans-affairs/platform-user/VerifyAlert';
import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';

export const heading =
  'You’ll need to verify your identity to access more VA.gov tools and features';

const NeedsToVerify = () => {
  const alertRef = useRef(null);

  useEffect(
    () => {
      if (alertRef?.current) {
        focusElement(alertRef.current);
      }
    },
    [alertRef],
  );

  recordEvent({
    event: 'visible-alert-box',
    'alert-box-type': 'continue',
    'alert-box-heading': heading,
    'error-key': 'not_verified',
    'alert-box-full-width': false,
    'alert-box-background-only': false,
    'alert-box-closeable': false,
    'reason-for-alert': `Not verified`,
  });

  return <VerifyAlert headingLevel={2} ref={alertRef} />;
};

export default NeedsToVerify;

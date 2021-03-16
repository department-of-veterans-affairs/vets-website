import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

export const ESR_ERROR_TYPES = Object.freeze({
  generic: 'generic',
  inContext: 'inContext',
});

const headlines = {
  [ESR_ERROR_TYPES.generic]:
    'We can’t access health care enrollment information right now',
  [ESR_ERROR_TYPES.inContext]:
    'We can’t display your VA health care enrollment information right now',
};

const contents = {
  [ESR_ERROR_TYPES.generic]:
    'We’re sorry. We’re having trouble accessing health care enrollment information right now. If you’ve recently applied for VA health care, or if you’re currently enrolled, some of your information may not appear below. We’re working to fix this as quickly as we can.',
  [ESR_ERROR_TYPES.inContext]:
    'We’re sorry. We’re having trouble accessing health care enrollment information right now. Your application and enrollment dates, as well as your preferred VA medical center, won’t appear until we fix this problem. We’re working to fix it as quickly as we can.',
};

/**
 * Error message to show on the Dashboard if there is an error connecting to ESR
 * via the enrollment_status endpoint
 */
const ESRError = ({ errorType = ESR_ERROR_TYPES.generic }) => (
  <AlertBox
    level="2"
    content={contents[errorType]}
    headline={headlines[errorType]}
    status="error"
  />
);

export default ESRError;

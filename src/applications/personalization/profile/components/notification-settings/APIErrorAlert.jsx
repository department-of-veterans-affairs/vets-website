import React from 'react';

import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

const APIErrorAlert = () => {
  return (
    <AlertBox status="error">
      We’re sorry. We can’t access your notification settings at this time.
      We’re working to fix this problem. Please check back soon.
    </AlertBox>
  );
};
export default APIErrorAlert;

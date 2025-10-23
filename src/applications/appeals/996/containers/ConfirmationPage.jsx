import React from 'react';

import { resetStoredSubTask } from '@department-of-veterans-affairs/platform-forms/sub-task';

import ConfirmationPageV2 from '../components/ConfirmationPageV2';

export const ConfirmationPage = () => {
  resetStoredSubTask();

  return <ConfirmationPageV2 />;
};

export default ConfirmationPage;

import React, { useEffect } from 'react';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import content from '../../locales/en/content.json';

const SubmissionErrorAlert = () => {
  useEffect(() => {
    focusElement('.ezr-error-message');
  }, []);

  return (
    <div className="ezr-error-message vads-u-margin-bottom--4">
      <va-alert status="error">
        <h3 slot="headline">{content['alert-submission-title']}</h3>
        <p>{content['alert-submission-message']}</p>
      </va-alert>
    </div>
  );
};

export default SubmissionErrorAlert;

import React, { useEffect } from 'react';
import { focusElement } from 'platform/utilities/ui';
import content from '../../locales/en/content.json';

const SubmissionErrorAlert = () => {
  useEffect(() => {
    focusElement('.ezr-error-message');
  }, []);

  return (
    <div className="ezr-error-message vads-u-margin-top--5">
      <va-alert status="error" uswds>
        <h3 slot="headline">{content['alert-submission-title']}</h3>
        <div>
          <p>{content['alert-submission-message']}</p>
        </div>
      </va-alert>
    </div>
  );
};

export default SubmissionErrorAlert;

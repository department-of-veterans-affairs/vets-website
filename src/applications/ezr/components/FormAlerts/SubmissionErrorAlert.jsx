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
          <p>{content['alert-submission-primary-message']}</p>
          <p>{content['alert-submission-secondary-message']}</p>
        </div>
        <va-link
          href="/health-care/update-health-information/#how-do-i-update-my-information"
          text="Learn more about how to update your information by mail, phone, or in person"
        />
      </va-alert>
    </div>
  );
};

export default SubmissionErrorAlert;

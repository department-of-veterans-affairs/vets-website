import React from 'react';
import content from '../../locales/en/content.json';

const EnrollmentStatusAlert = () => (
  <va-alert status="warning" class="vads-u-margin-y--4" uswds>
    <h3 slot="headline">{content['alert-enrollment-title']}</h3>
    <p>{content['alert-enrollment-message']}</p>
    <a
      className="vads-c-action-link--green"
      href="/health-care/apply/application"
    >
      {content['alert-enrollment-action']}
    </a>
  </va-alert>
);

export default EnrollmentStatusAlert;

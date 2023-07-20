import React from 'react';
import { environment } from '@department-of-veterans-affairs/platform-utilities';

const url = path => `${environment.BaseUrl}${path}`;

const UnknownGroup = () => (
  <va-alert close-btn-aria-label="Close notification" status="success" visible>
    <h2 slot="headline">You have not yet been assigned to a priority group</h2>
    <div>
      <p className="vads-u-margin-y--0">
        When you apply for VA health care, we’ll assign you to 1 of 8 priority
        groups. If you have already applied for VA health care, you will see
        your priority group here once it is assigned.If you have not applied for
        VA health care, you can
        <a href={url('/health-care/how-to-apply')}>
          learn more about the application process
        </a>
        .
      </p>
    </div>
  </va-alert>
);

export default UnknownGroup;

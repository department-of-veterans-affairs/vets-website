import React from 'react';
import { CAREERS_EMPLOYMENT_ROOT_URL } from 'applications/vre/28-1900/constants';
import { serviceMemberPathPageNames } from '../pageList';
import { recordNotificationEvent, fireLinkClickEvent } from '../helpers';

const NoIDES = () => {
  recordNotificationEvent('ineligibility - does not have a disability rating');
  return (
    <va-card
      background
      class="vads-u-margin-bottom--3"
      aria-live="polite"
      aria-atomic="true"
    >
      <p id="ineligible-notice">
        To be eligible for VR&E benefits, you must have a service-connected
        disability and an employment handicap in which your disability limits
        your ability to get a job.
      </p>
      <a
        onClick={e => fireLinkClickEvent(e)}
        href={CAREERS_EMPLOYMENT_ROOT_URL}
        aria-describedby="ineligible-notice"
      >
        Find out about VA educational and career counseling
      </a>
    </va-card>
  );
};

export default {
  name: serviceMemberPathPageNames.noIDES,
  component: NoIDES,
};

import React from 'react';
import { serviceMemberPathPageNames } from '../pageList';
import { CAREERS_EMPLOYMENT_ROOT_URL } from 'applications/vre/28-1900/constants';
import { recordNotificationEvent, fireLinkClickEvent } from '../helpers';

const NoIDES = () => {
  recordNotificationEvent('ineligibility - does not have a disability rating');
  return (
    <div className="feature vads-u-background-color--gray-lightest">
      <p>
        To be eligible for VR&E benefits, you must have a service-connected
        disability and an employment handicap in which your disability limits
        your ability to get a job.
      </p>
      <a
        onClick={e => fireLinkClickEvent(e)}
        href={CAREERS_EMPLOYMENT_ROOT_URL}
      >
        Find out about VA educational and career counseling
      </a>
    </div>
  );
};

export default {
  name: serviceMemberPathPageNames.noIDES,
  component: NoIDES,
};

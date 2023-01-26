import React from 'react';
import { CAREERS_EMPLOYMENT_ROOT_URL } from 'applications/vre/28-1900/constants';
import { veteranPathPageNames } from '../pageList';
import { recordNotificationEvent, fireLinkClickEvent } from '../helpers';

const NoDisabilityRating = () => {
  recordNotificationEvent('ineligibility - does not have disability rating');
  return (
    <div
      id={veteranPathPageNames.noDisabilityRating}
      className="feature vads-u-background-color--gray-lightest"
      aria-live="polite"
      aria-atomic="true"
    >
      <p id="ineligible-disability-notice">
        To be eligible for VR&E benefits, you must have a service-connected
        disability and an employment handicap in which your disability limits
        your ability to get a job.
      </p>
      <a
        onClick={e => fireLinkClickEvent(e)}
        href={CAREERS_EMPLOYMENT_ROOT_URL}
        aria-describedby="ineligible-disability-notice"
      >
        Find out about VA educational and career counseling
      </a>
    </div>
  );
};

export default {
  name: veteranPathPageNames.noDisabilityRating,
  component: NoDisabilityRating,
};

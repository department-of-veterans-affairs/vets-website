import React from 'react';
import { serviceMemberPathPageNames } from '../pageList';
import { recordNotificationEvent, fireLinkClickEvent } from '../helpers';

const NoHonorableDischargeSM = () => {
  recordNotificationEvent('ineligibility - received a dishonorable discharge');
  return (
    <va-card
      background
      class="vads-u-margin-bottom--3"
      aria-live="polite"
      aria-atomic="true"
    >
      <p id="dishonorable-discharge-notice">
        To apply for VR&E benefits, you must have received an other than
        dishonorable discharge.
      </p>
      <a
        onClick={e => fireLinkClickEvent(e)}
        href="/discharge-upgrade-instructions/"
        aria-describedby="dishonorable-discharge-notice"
      >
        Learn more about how to apply for a discharge upgrade
      </a>
    </va-card>
  );
};

export default {
  name: serviceMemberPathPageNames.noHonorableDischargeSM,
  component: NoHonorableDischargeSM,
};

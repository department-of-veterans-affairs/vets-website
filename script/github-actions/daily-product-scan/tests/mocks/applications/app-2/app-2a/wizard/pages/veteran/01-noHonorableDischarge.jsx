import React from 'react';
import { veteranPathPageNames } from '../pageList';
import { recordNotificationEvent, fireLinkClickEvent } from '../helpers';

const NoHonorableDischarge = () => {
  recordNotificationEvent('ineligibility - received a dishonorable discharge');
  return (
    <va-featured-content
      className="vads-u-background-color--gray-lightest"
      aria-live="polite"
      aria-atomic="true"
    >
      <p id="dishonorable-discharge-notice">
        To apply for VR&E benefits, you must have received{' '}
        <strong>an other than</strong> dishonorable discharge.
      </p>
      <a
        onClick={e => fireLinkClickEvent(e)}
        href="/discharge-upgrade-instructions/"
        aria-describedby="dishonorable-discharge-notice"
      >
        Learn more about how to apply for a discharge upgrade
      </a>
    </va-featured-content>
  );
};

export default {
  name: veteranPathPageNames.noHonorableDischarge,
  component: NoHonorableDischarge,
};

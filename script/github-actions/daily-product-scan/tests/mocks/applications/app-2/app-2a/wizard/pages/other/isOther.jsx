import React, { useEffect } from 'react';
import { CAREERS_EMPLOYMENT_ROOT_URL } from 'applications/vre/28-1900/constants';
import { otherPathPageNames } from '../pageList';
import { recordNotificationEvent, fireLinkClickEvent } from '../helpers';

const AmOther = props => {
  const { setWizardStatus } = props;
  useEffect(() => {
    setWizardStatus(false);
  }, [setWizardStatus]);
  recordNotificationEvent('ineligibility - is not a Veteran or Service Member');
  return (
    <va-card
      background
      class="vads-u-margin-bottom--3"
      aria-live="polite"
      aria-atomic="true"
    >
      <p id="ineligible-user-type-notice">
        To apply for VR&E benefits, you must be either a Veteran or active-duty
        service member.
      </p>
      <a
        onClick={e => fireLinkClickEvent(e)}
        href={CAREERS_EMPLOYMENT_ROOT_URL}
        aria-describedby="ineligible-user-type-notice"
      >
        Find out about VA educational and career counseling
      </a>
    </va-card>
  );
};

export default {
  name: otherPathPageNames.isOther,
  component: AmOther,
};

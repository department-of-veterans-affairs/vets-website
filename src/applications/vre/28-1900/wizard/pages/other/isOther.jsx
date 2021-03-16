import React, { useEffect } from 'react';
import { WIZARD_STATUS_NOT_STARTED } from 'platform/site-wide/wizard';
import { otherPathPageNames } from '../pageList';
import { CAREERS_EMPLOYMENT_ROOT_URL } from 'applications/vre/28-1900/constants';
import { recordNotificationEvent, fireLinkClickEvent } from '../helpers';

const AmOther = props => {
  const { setWizardStatus } = props;
  useEffect(
    () => {
      setWizardStatus(WIZARD_STATUS_NOT_STARTED);
    },
    [setWizardStatus],
  );
  recordNotificationEvent('ineligibility - is not a Veteran or Service Member');
  return (
    <div className="feature vads-u-background-color--gray-lightest">
      <p>
        To apply for VR&E benefits, you must be either a Veteran or active-duty
        service member.
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
  name: otherPathPageNames.isOther,
  component: AmOther,
};

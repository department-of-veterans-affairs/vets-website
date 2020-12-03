import React, { useEffect } from 'react';
import { otherPathPageNames } from '../pageList';
import {
  WIZARD_STATUS_INELIGIBLE,
  CAREERS_EMPLOYMENT_ROOT_URL,
} from 'applications/vre/28-1900/constants';

const AmOther = props => {
  const { setWizardStatus } = props;
  useEffect(
    () => {
      setWizardStatus(WIZARD_STATUS_INELIGIBLE);
    },
    [setWizardStatus],
  );
  return (
    <div className="feature vads-u-background-color--gray-lightest">
      <p>
        To apply for VR&E benefits, you must be either a Veteran or active-duty
        service member.
      </p>
      <a href={CAREERS_EMPLOYMENT_ROOT_URL}>
        Find out about VA educational and career counseling
      </a>
    </div>
  );
};

export default {
  name: otherPathPageNames.isOther,
  component: AmOther,
};

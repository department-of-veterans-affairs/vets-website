import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';

import { EligibilityLink } from '../EligibilityLink';

export const EduMigrationDowntimeAlert = () => {
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const isAlertToggleEnabled = useToggleValue(
    TOGGLE_NAMES.profileShowDirectDepositSingleFormEduDowntime,
  );
  if (!isAlertToggleEnabled) {
    return null;
  }
  return (
    <>
      <va-alert
        status="warning"
        uswds
        data-testid="edu-migration-downtime-alert"
      >
        <div>
          <h2
            slot="headline"
            className="vads-u-margin-top--0 vads-u-font-size--lg"
          >
            You can’t manage your direct deposit information right now
          </h2>
          <p className="vads-u-margin-y--0">
            We’re updating our systems for online direct deposit management. You
            can still manage your information by phone.
          </p>

          <p className="vads-u-margin-bottom--0">
            If you need to manage your direct deposit information for education
            benefits during this time, call us at{' '}
            <va-telephone contact={CONTACTS.GI_BILL} /> (
            <va-telephone contact={CONTACTS['711']} tty />
            ). We’re here Monday through Friday, 8:00 a.m. to 7:00 p.m. ET.
          </p>
        </div>
      </va-alert>

      <div className="vads-u-margin-top--2p5">
        <EligibilityLink typeIsCNP={false} />
      </div>
    </>
  );
};

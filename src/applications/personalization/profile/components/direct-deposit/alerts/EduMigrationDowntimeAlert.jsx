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
          <p className="vads-u-margin-y--0">
            We’re updating our systems for online direct deposit management.
          </p>
          <p className="vads-u-margin-bottom--0">
            If you need to manage your direct deposit information for education
            benefits, call us at <va-telephone contact={CONTACTS.VA_BENEFITS} />{' '}
            (<va-telephone contact={CONTACTS['711']} tty />
            ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
          </p>
        </div>
      </va-alert>

      <div className="vads-u-margin-top--2p5">
        <EligibilityLink typeIsCNP={false} />
      </div>
    </>
  );
};

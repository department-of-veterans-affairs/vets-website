import React, { useEffect } from 'react';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';

import { focusElement } from 'platform/utilities/ui';
import { handleDowntimeForSection } from 'applications/personalization/profile360/components/DowntimeBanner';
import PersonalInformationContent from './PersonalInformationContent';

const PersonalInformation = () => {
  useEffect(() => {
    focusElement('[data-focus-target]');
  }, []);

  return (
    <>
      <h2
        tabIndex="-1"
        className="vads-u-margin-y--2 medium-screen:vads-u-margin-bottom--4 medium-screen:vads-u-margin-top--3"
        data-focus-target
      >
        Personal and contact information
      </h2>
      <DowntimeNotification
        appTitle="Personal and Contact Information"
        render={handleDowntimeForSection('personal and contact')}
        dependencies={[externalServices.mvi, externalServices.vet360]}
      >
        <PersonalInformationContent />
      </DowntimeNotification>
    </>
  );
};

export default PersonalInformation;

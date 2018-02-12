import React from 'react';

import PartialDowntimeNotification from '../../common/containers/PartialDowntimeNotification';
import { services } from '../../common/containers/DowntimeNotification';

export default function EducationDowntime({ children }) {
  return (
    <PartialDowntimeNotification appTitle="education benefits application" dependencies={[services.tims]}>
      {children}
    </PartialDowntimeNotification>
  );
}

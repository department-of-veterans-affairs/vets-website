import React from 'react';

import PartialDowntimeNotification from '../common/containers/PartialDowntimeNotification';
import { services } from '../common/containers/DowntimeNotification';
import FormApp from '../common/schemaform/containers/FormApp';
import formConfig from './config/form';

export default function HealthCareEntry({ location, children }) {
  return (
    <PartialDowntimeNotification appTitle="health care benefits application" dependencies={[services.es]}>
      <FormApp formConfig={formConfig} currentLocation={location}>
        {children}
      </FormApp>
    </PartialDowntimeNotification>
  );
}

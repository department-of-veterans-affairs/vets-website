import React from 'react';

import DowntimeNotification, { services } from '../common/containers/DowntimeNotification';
import FormApp from '../common/schemaform/containers/FormApp';
import formConfig from './config/form';

export default function HealthCareEntry({ location, children }) {
  return (
    <DowntimeNotification appTitle="Healthcare Application" dependencies={[services.es]}>
      <FormApp formConfig={formConfig} currentLocation={location}>
        {children}
      </FormApp>
    </DowntimeNotification>
  );
}

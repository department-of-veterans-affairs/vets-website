import React from 'react';

import { PtsdNameTitle } from '../content/ptsdClassification';
import { recordsPermissionNotice } from '../content/secondaryIncidentPermissionNotice';

export const uiSchema = {
  'ui:title': ({ formData }) => (
    <PtsdNameTitle formData={formData} formType="781a" />
  ),
  'ui:description': recordsPermissionNotice,
};

export const schema = {
  type: 'object',
  properties: {},
};

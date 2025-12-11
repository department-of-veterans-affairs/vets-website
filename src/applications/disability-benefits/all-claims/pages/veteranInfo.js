import React from 'react';
import VeteranDetails from '../components/VeteranDetails';
import UpdateMilitaryHistory from '../components/UpdateMilitaryHistory';
import { ConfirmationVeteranInfo } from '../components/confirmationFields/ConfirmationVeteranInfo';

export const uiSchema = {
  // update separation date from wizard (BDD)
  'ui:title': <UpdateMilitaryHistory />,
  'ui:description': <VeteranDetails />,
  'ui:options': {
    forceDivWrapper: true,
    showFieldLabel: false,
  },
  'ui:confirmationField': ConfirmationVeteranInfo,
};

export const schema = {
  type: 'object',
  properties: {},
};

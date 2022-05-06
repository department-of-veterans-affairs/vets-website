import React from 'react';
import { veteranInfoDescription } from '../content/veteranDetails';
import UpdateMilitaryHistory from '../components/UpdateMilitaryHistory';

export const uiSchema = {
  // update separation date from wizard (BDD)
  'ui:title': <UpdateMilitaryHistory />,
  'ui:description': veteranInfoDescription,
  'ui:options': {
    forceDivWrapper: true,
    showFieldLabel: false,
  },
};

export const schema = {
  type: 'object',
  properties: {},
};

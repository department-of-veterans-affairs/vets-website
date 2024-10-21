import React from 'react';

import { showNewHlrContent } from '../utils/helpers';

export const homelessPageTitle = formData =>
  showNewHlrContent(formData) ? 'Housing situation' : 'Homelessness question';

export const homelessPageHeader = ({ formData }) =>
  showNewHlrContent(formData) ? (
    <h3 className="vads-u-margin--0">Housing situation</h3>
  ) : (
    ' '
  );

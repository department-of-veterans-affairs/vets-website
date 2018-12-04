import React from 'react';
import { ptsd781NameTitle } from '../content/ptsdClassification';

const conclusionDescription = (
  <div>
    <p>
      Thank you for taking the time to answer our questions. The information you
      provided will help us research your claim.
    </p>
  </div>
);

export const uiSchema = {
  'ui:title': ptsd781NameTitle,
  'ui:description': conclusionDescription,
};

export const schema = {
  type: 'object',
  properties: {},
};

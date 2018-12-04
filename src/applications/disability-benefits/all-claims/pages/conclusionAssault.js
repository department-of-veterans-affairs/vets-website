import React from 'react';
import { ptsd781aNameTitle } from '../content/ptsdClassification';

const conclusionDescription = (
  <div>
    <p>
      Thank you for answering our questions. The information you provided will
      help us research your claim.
    </p>
  </div>
);

export const uiSchema = {
  'ui:title': ptsd781aNameTitle,
  'ui:description': conclusionDescription,
};

export const schema = {
  type: 'object',
  properties: {},
};

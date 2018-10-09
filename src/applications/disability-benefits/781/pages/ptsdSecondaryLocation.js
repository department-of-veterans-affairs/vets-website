import React from 'react';

import { PtsdNameTitle } from '../helpers';

const ptsdLocationDescription = () => (
  <div>
    <h5>Event location</h5>
    <p>
      Where did the event happen? Please be as specific as you can and include
      the name of the city, state, country, province, landmark, or military
      installation.
    </p>
  </div>
);

export const uiSchema = {
  'ui:title': PtsdNameTitle,
  'ui:description': ptsdLocationDescription,
  secondaryIncidentCountry: {
    'ui:title': 'Country',
  },
  secondaryIncidentState: {
    'ui:title': 'State/Province',
  },
  secondaryIncidentCity: {
    'ui:title': 'City',
  },
  secondaryIncidentLandMark: {
    'ui:title': 'Landmark or Military Installation',
  },
  secondaryAdditionalDetails: {
    'ui:title': 'Landmark or Military Installation',
  },
};

export const schema = {
  type: 'object',
  properties: {
    secondaryIncidentCountry: {
      type: 'string',
    },
    secondaryIncidentState: {
      type: 'string',
    },
    secondaryIncidentCity: {
      type: 'string',
    },
    secondaryIncidentLandMark: {
      type: 'string',
    },
  },
};

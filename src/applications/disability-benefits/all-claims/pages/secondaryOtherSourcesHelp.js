import React from 'react';

import { PtsdNameTitle } from '../content/ptsdClassification';

const otherSourcesHelpDescription = (
  <div>
    <h3>Help with other sources of information</h3>
    <p>What information can we help you gather?</p>
  </div>
);

export const uiSchema = index => ({
  'ui:title': ({ formData }) => (
    <PtsdNameTitle formData={formData} formType="781a" />
  ),
  'ui:description': otherSourcesHelpDescription,
  [`secondaryIncident${index}`]: {
    otherSourcesHelp: {
      'view:helpPrivateMedicalTreatment': {
        'ui:title':
          'I’d like help getting my private medical treatment or counseling records.',
      },
      'view:helpRequestingStatements': {
        'ui:title':
          'I’d like help requesting statements I made to military or civilian authorities.',
      },
    },
  },
});

export const schema = index => ({
  type: 'object',
  properties: {
    [`secondaryIncident${index}`]: {
      type: 'object',
      properties: {
        otherSourcesHelp: {
          type: 'object',
          properties: {
            'view:helpPrivateMedicalTreatment': {
              type: 'boolean',
            },
            'view:helpRequestingStatements': {
              type: 'boolean',
            },
          },
        },
      },
    },
  },
});

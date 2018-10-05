import React from 'react';
import { PtsdNameTitle } from '../helpers';
import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';

const otherSourcesSecondaryDescription = (
  <div>
    <h5>Other sources of information</h5>
    <p>
      If you were treated at a military or private facility for this event, or
      reported the event to the authorities or other parties, we can help you
      gather supporting information from them for your claim.
    </p>
    <p>
      If you have supporting (lay) statements from friends, family, or clergy or
      have copies of reports from authorities, you‘ll be able to upload those
      later in the application.
    </p>
  </div>
);

const otherSourcesSecondaryHelp = (
  <AdditionalInfo triggerText="Which option should I choose?">
    <h5>If you need help getting private medical treatment records</h5>
    <p>
      You’ll need to authorize us to request your medical records from private
      health care providers and counselors. You’ll have a chance to do this
      later in the Supporting Evidence section of the application.
    </p>
    <h5>
      If you need help getting statements from military or civilian authorities
    </h5>
    <p>
      We can request reports from authorities who you’ve reported the event to.
      We’ll need their name and contact information, if you have them, to
      request relevant documents on your behalf.
    </p>
    <h5>If you don’t need help getting evidence for your claim</h5>
    <p>
      Choose this option if you don’t need our help gathering supporting
      evidence or reports, or if you already have copies of your supporting
      documents and can upload them directly.
    </p>
  </AdditionalInfo>
);

export const uiSchema = {
  'ui:title': ({ formData }) => (
    <PtsdNameTitle formData={formData} formType="781a" />
  ),
  'ui:description': otherSourcesSecondaryDescription,
  gatherInformation: {
    'ui:title': 'Would you like us to help you gather this information?',
    'ui:widget': 'radio',
    'ui:options': {
      labels: {
        yes: 'Yes, I’d like help getting supporting evidence and information',
        no: 'No, I don’t need help with this.',
      },
    },
  },
  'view:isSecondaryHelp': {
    'ui:options': {
      expandUnder: 'gatherInformation',
      expandUnderCondition: 'yes',
    },
    howToHelpSecondary: {
      'view:helpPrivateMedicalTreatment': {
        'ui:title':
          'I‘d like your help getting my private medical treatment or counseling records.',
      },
      'view:helpRequestingStatements': {
        'ui:title':
          'I‘d like your help requesting statements I made to military or civilian authorities.',
      },
    },
  },
  'view:otherSourcesSecondaryHelp': {
    'ui:description': otherSourcesSecondaryHelp,
  },
};

export const schema = {
  type: 'object',
  properties: {
    gatherInformation: {
      type: 'string',
      enum: ['yes', 'no'],
    },
    'view:isSecondaryHelp': {
      type: 'object',
      properties: {
        howToHelpSecondary: {
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
    'view:otherSourcesSecondaryHelp': {
      type: 'object',
      properties: {},
    },
  },
};

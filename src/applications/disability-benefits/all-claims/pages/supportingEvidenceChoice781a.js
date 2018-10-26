import React from 'react';

import { PtsdNameTitle } from '../content/ptsdClassification';

const supportingDocumentsSecondaryDescription = (
  <div>
    <h5>Supporting Documents</h5>
    <p>
      If you have other documents to support your PTSD claim, you’ll be able to
      add those next.
    </p>
    <p>
      Some examples of other documents that could help support your claim
      include:
    </p>
    <ul>
      <li>
        Copy of a DD-2911 (DoD Sexual Assault Forensic Examination (SAFE)
        Report)
      </li>
      <li>Military or civilian police reports that you haven’t yet uploaded</li>
      <li>
        Supporting statements from roommates, family members, clergy, or fellow
        Servicemembers
      </li>
      <li>Your personal journals or diaries</li>
    </ul>
  </div>
);

export const uiSchema = {
  'ui:title': ({ formData }) => (
    <PtsdNameTitle formData={formData} formType="781a" />
  ),
  'ui:description': supportingDocumentsSecondaryDescription,
  'view:evidenceUpload781a': {
    'ui:title': 'Do you have supporting documents you would like to upload?',
    'ui:widget': 'yesNo',
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:evidenceUpload781a': {
      type: 'boolean',
    },
  },
};

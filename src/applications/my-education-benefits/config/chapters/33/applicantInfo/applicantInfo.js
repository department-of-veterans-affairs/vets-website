import React from 'react';
import ApplicantIdentityView from '../../../../components/ApplicantIdentityView';
import { formFields } from '../../../../constants';

const applicantInformation33 = {
  uiSchema: {
    [formFields.formId]: {
      'ui:title': 'Form ID',
      'ui:disabled': true,
      'ui:options': {
        hideOnReview: true,
      },
    },
    [formFields.claimantId]: {
      'ui:title': 'Claimant ID',
      'ui:disabled': true,
      'ui:options': {
        hideOnReview: true,
      },
    },
    'view:applicantInformation': {
      'ui:description': (
        <>
          <ApplicantIdentityView />
        </>
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      [formFields.formId]: {
        type: 'string',
      },
      [formFields.claimantId]: {
        type: 'integer',
      },
      'view:subHeadings': {
        type: 'object',
        properties: {},
      },
      'view:applicantInformation': {
        type: 'object',
        properties: {},
      },
    },
  },
};

export default applicantInformation33;
